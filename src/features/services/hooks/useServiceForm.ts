"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FEMALE_CATEGORIES, MALE_CATEGORIES } from "@/features/livestock";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { serviceFormSchema, ServiceFormData, Service } from "../types";
import {
  useServiceTypes,
  useSemenBatches,
  useEmbrionBatches,
} from "./useServices";
import { useTechnicians } from "@/features/technicians";
import { useCreateService, useUpdateService } from "./useMutateServices";

interface UseServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  femaleId?: number | null;
  initialData?: Service;
}

export function useServiceForm({
  open,
  onOpenChange,
  femaleId,
  initialData,
}: UseServiceFormProps) {
  const isEdit = !!initialData;

  // React Query para catálogos
  const { data: serviceTypes = [], isLoading: isLoadingTypes } = useServiceTypes();
  const { data: semenBatches = [], isLoading: isLoadingSemen } = useSemenBatches();
  const { data: embrionBatches = [], isLoading: isLoadingEmbrion } = useEmbrionBatches();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();
  
  // Obtenemos ganado para hembras y padrotes
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
  const isPending = isCreating || isUpdating;

  // Filtrado de hembras
  const femaleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && FEMALE_CATEGORIES.includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    // Asegurar que si hay una hembra inicial se agregue a las opciones
    if (initialData?.female && !list.some((item) => item.id === initialData.female_id)) {
      list.push({
        id: initialData.female_id,
        name: `${initialData.female.brand_number} ${initialData.female.name ? `- ${initialData.female.name}` : ""}`,
      });
    }

    return list;
  }, [livestockList, initialData]);

  // Filtrado de machos (padrotes)
  const bullOptions = useMemo(() => {
    return livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && MALE_CATEGORIES.includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));
  }, [livestockList]);

  // Mapeos para lotes
  const semenOptions = useMemo(() => {
    return semenBatches.map((b) => ({ id: b.id, name: `${b.code} - ${b.name}` }));
  }, [semenBatches]);

  const embrionOptions = useMemo(() => {
    return embrionBatches.map((b) => ({ id: b.id, name: `${b.code} - ${b.name}` }));
  }, [embrionBatches]);

  const technicianOptions = useMemo(() => {
    return technicians.map((t) => ({ id: t.id, name: t.name }));
  }, [technicians]);

  // Valores por defecto
  const defaultValues = useMemo<Partial<ServiceFormData>>(() => {
    if (initialData) {
      return {
        female_id: initialData.female_id,
        service_type_id: initialData.service_type_id,
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        technician_id: initialData.technician_id,
        parentable_type: initialData.parentable_type,
        parentable_id: initialData.parentable_id,
      };
    }
    return {
      female_id: femaleId || undefined,
      service_type_id: undefined,
      made_at: new Date().toISOString().split("T")[0],
      technician_id: null,
      parentable_type: undefined,
      parentable_id: undefined,
    };
  }, [initialData, femaleId]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const parentableType = watch("parentable_type");
  const isFirstRender = useRef(true);

  // Reiniciar el formulario y la bandera del primer renderizado al abrir
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      isFirstRender.current = true;
    }
  }, [open, reset, defaultValues]);

  // Limpiar parentable_id únicamente si cambia el parentable_type por interacción del usuario
  useEffect(() => {
    if (parentableType === undefined) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setValue("parentable_id", undefined as any);
  }, [parentableType, setValue]);

  const onSubmit = (data: ServiceFormData) => {
    if (isEdit && initialData) {
      updateService(
        { id: initialData.id, formData: data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createService(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isFormLoading =
    isLoadingTypes ||
    isLoadingSemen ||
    isLoadingEmbrion ||
    isLoadingTechnicians ||
    isLoadingLivestock;

  return {
    isEdit,
    isFormLoading,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    parentableType,
    femaleOptions,
    bullOptions,
    semenOptions,
    embrionOptions,
    technicianOptions,
    serviceTypes,
    onSubmit,
  };
}
