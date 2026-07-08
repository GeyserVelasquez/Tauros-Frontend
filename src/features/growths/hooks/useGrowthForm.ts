"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { useTechnicians } from "@/features/technicians";
import { growthFormSchema, GrowthFormData, Growth } from "../types";
import { useGrowthTypes } from "./useGrowths";
import { useCreateGrowth, useUpdateGrowth } from "./useMutateGrowths";

interface UseGrowthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
  initialData?: Growth;
}

export function useGrowthForm({
  open,
  onOpenChange,
  livestockId,
  initialData,
}: UseGrowthFormProps) {
  const isEdit = !!initialData;

  // Catálogos
  const { data: growthTypes = [], isLoading: isLoadingTypes } = useGrowthTypes();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();

  // Ganado sin restricciones de categorías (todas las edades/sexos pueden pesarse)
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({
    per_page: 1000,
  });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createGrowth, isPending: isCreating } = useCreateGrowth();
  const { mutate: updateGrowth, isPending: isUpdating } = useUpdateGrowth();
  const isPending = isCreating || isUpdating;

  // Opciones de ganado
  const livestockOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled)
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData?.livestock && !list.some((item) => item.id === initialData.livestock_id)) {
      list.push({
        id: initialData.livestock_id,
        name: `${initialData.livestock.brand_number} ${initialData.livestock.name ? `- ${initialData.livestock.name}` : ""}`,
      });
    }

    return list;
  }, [livestockList, initialData]);

  const technicianOptions = useMemo(() => {
    return technicians.map((t) => ({ id: t.id, name: t.name }));
  }, [technicians]);

  // Valores por defecto
  const defaultValues = useMemo<Partial<GrowthFormData>>(() => {
    if (initialData) {
      return {
        livestock_id: initialData.livestock_id,
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        growth_type_id: initialData.growth_type_id,
        weight: initialData.weight,
        height: initialData.height ?? undefined,
        length: initialData.length ?? undefined,
        thoracic_width: initialData.thoracic_width ?? undefined,
        technician_id: initialData.technician_id,
      };
    }
    return {
      livestock_id: livestockId || undefined,
      made_at: new Date().toISOString().split("T")[0],
      growth_type_id: undefined,
      weight: undefined,
      height: undefined,
      length: undefined,
      thoracic_width: undefined,
      technician_id: null,
    };
  }, [initialData, livestockId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GrowthFormData>({
    resolver: zodResolver(growthFormSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  // Resetear el formulario al abrir o cambiar datos iniciales
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: GrowthFormData) => {
    if (isEdit && initialData) {
      updateGrowth(
        { id: initialData.id, formData: data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createGrowth(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isFormLoading = isLoadingTypes || isLoadingTechnicians || isLoadingLivestock;

  return {
    isEdit,
    isFormLoading,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    livestockOptions,
    technicianOptions,
    growthTypes,
    onSubmit,
  };
}
