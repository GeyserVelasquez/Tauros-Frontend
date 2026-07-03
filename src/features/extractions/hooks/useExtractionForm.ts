"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { useTechnicians } from "@/features/technicians";
import { extractionFormSchema, ExtractionFormData, Extraction, SemenBatch, EmbrionBatch } from "../types";
import { useExtractionTypes } from "./useExtractions";
import { useCreateExtraction, useUpdateExtraction } from "./useMutateExtractions";

interface UseExtractionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Extraction;
}

export function useExtractionForm({
  open,
  onOpenChange,
  initialData,
}: UseExtractionFormProps) {
  const isEdit = !!initialData;

  // Catálogos
  const { data: extractionTypes = [], isLoading: isLoadingTypes } = useExtractionTypes();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();

  // Lista de Ganado para donantes y padres
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createExtraction, isPending: isCreating } = useCreateExtraction();
  const { mutate: updateExtraction, isPending: isUpdating } = useUpdateExtraction(initialData?.id || 0);
  const isPending = isCreating || isUpdating;

  // Filtrado de machos (toros y novillos)
  const maleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && ["bull", "steer"].includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    // Inyectar el donante/padre inicial si no está en la lista activa
    if (initialData) {
      const isSemen = initialData.geneticable_type.includes("SemenBatch") || initialData.geneticable_type === "semen_batch";
      const batch = initialData.geneticable;
      
      if (isSemen && batch) {
        const semenBatch = batch as SemenBatch;
        if (semenBatch.livestock && !list.some((item) => item.id === semenBatch.livestock_id)) {
          list.push({
            id: semenBatch.livestock_id,
            name: `${semenBatch.livestock.brand_number} ${semenBatch.livestock.name ? `- ${semenBatch.livestock.name}` : ""}`,
          });
        }
      } else if (!isSemen && batch) {
        const embrionBatch = batch as EmbrionBatch;
        if (embrionBatch.father && !list.some((item) => item.id === embrionBatch.father_id)) {
          list.push({
            id: embrionBatch.father_id!,
            name: `${embrionBatch.father.brand_number} ${embrionBatch.father.name ? `- ${embrionBatch.father.name}` : ""}`,
          });
        }
      }
    }

    return list;
  }, [livestockList, initialData]);

  // Filtrado de hembras (vacas y novillas)
  const femaleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && ["cow", "heifer", "female_yearling", "heifer_calf"].includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData) {
      const isSemen = initialData.geneticable_type.includes("SemenBatch") || initialData.geneticable_type === "semen_batch";
      const batch = initialData.geneticable;
      
      if (!isSemen && batch) {
        const embrionBatch = batch as EmbrionBatch;
        if (embrionBatch.mother && !list.some((item) => item.id === embrionBatch.mother_id)) {
          list.push({
            id: embrionBatch.mother_id,
            name: `${embrionBatch.mother.brand_number} ${embrionBatch.mother.name ? `- ${embrionBatch.mother.name}` : ""}`,
          });
        }
      }
    }

    return list;
  }, [livestockList, initialData]);

  const technicianOptions = useMemo(() => {
    return technicians.map((t) => ({ id: t.id, name: t.name }));
  }, [technicians]);

  // Valores por defecto
  const defaultValues = useMemo<Partial<ExtractionFormData>>(() => {
    if (initialData) {
      const isSemen = initialData.geneticable_type.includes("SemenBatch") || initialData.geneticable_type === "semen_batch";
      const batch = initialData.geneticable;
      return {
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        extraction_type_id: initialData.extraction_type_id,
        technician_id: initialData.technician_id,
        quantity: initialData.quantity || 1,
        geneticable_type: isSemen ? "semen_batch" : "embrion_batch",
        code: batch?.code || "",
        name: batch?.name || "",
        female_id: isSemen ? (batch as SemenBatch)?.livestock_id : (batch as EmbrionBatch)?.mother_id,
        male_id: isSemen ? null : (batch as EmbrionBatch)?.father_id || null,
      };
    }
    return {
      made_at: new Date().toISOString().split("T")[0],
      extraction_type_id: undefined,
      technician_id: null,
      quantity: 1,
      geneticable_type: "semen_batch",
      code: "",
      name: "",
      female_id: undefined,
      male_id: null,
    };
  }, [initialData]);

  const methods = useForm<ExtractionFormData>({
    resolver: zodResolver(extractionFormSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  // Reactivamente escuchar cambios en geneticable_type para resetear donante y padre
  const geneticableType = watch("geneticable_type");
  const previousGeneticableType = useRef(geneticableType);

  useEffect(() => {
    if (previousGeneticableType.current !== geneticableType) {
      setValue("female_id", undefined as any);
      setValue("male_id", null);
      previousGeneticableType.current = geneticableType;
    }
  }, [geneticableType, setValue]);

  // Reiniciar formulario al abrir
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  // Selección dinámica de la lista de donantes
  const donorOptions = geneticableType === "semen_batch" ? maleOptions : femaleOptions;

  const onSubmit = (data: ExtractionFormData) => {
    const payload = {
      ...data,
      geneticable_type: data.geneticable_type === "semen_batch" ? ("semen_batch" as const) : ("embrion_batch" as const),
    };

    if (isEdit && initialData) {
      updateExtraction(payload, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createExtraction(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isFormLoading = isLoadingTypes || isLoadingTechnicians || isLoadingLivestock;

  return {
    isEdit,
    isFormLoading,
    isPending,
    handleSubmit,
    control,
    errors,
    donorOptions,
    maleOptions, // Usado como sire candidates en embriones
    technicianOptions,
    extractionTypes,
    geneticableType,
    onSubmit,
  };
}
