"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { useTechnicians } from "@/features/technicians";
import { milkingFormSchema, MilkingFormData, Milking } from "../types";
import { useMilkingTypes } from "./useMilkings";
import { useCreateMilking, useUpdateMilking } from "./useMutateMilkings";

interface UseMilkingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
  initialData?: Milking;
}

export function useMilkingForm({
  open,
  onOpenChange,
  livestockId,
  initialData,
}: UseMilkingFormProps) {
  const isEdit = !!initialData;

  // Catálogos
  const { data: milkingTypes = [], isLoading: isLoadingTypes } = useMilkingTypes();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();

  // Ganado filtrado por el backend para vacas y novillas
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({
    "filter[animal_category]": "cow,heifer",
    per_page: 1000,
  });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createMilking, isPending: isCreating } = useCreateMilking();
  const { mutate: updateMilking, isPending: isUpdating } = useUpdateMilking();
  const isPending = isCreating || isUpdating;

  // Opciones de ganado hembra
  const femaleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled)
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    // Asegurarse de que el animal seleccionado inicialmente aparezca en la lista
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
  const defaultValues = useMemo<Partial<MilkingFormData>>(() => {
    if (initialData) {
      return {
        livestock_id: initialData.livestock_id,
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        milking_type_id: initialData.milking_type_id,
        first_weight: initialData.first_weight,
        second_weight: initialData.second_weight,
        third_weight: initialData.third_weight,
        technician_id: initialData.technician_id,
      };
    }
    return {
      livestock_id: livestockId || undefined,
      made_at: new Date().toISOString().split("T")[0],
      milking_type_id: undefined,
      first_weight: 0,
      second_weight: 0,
      third_weight: 0,
      technician_id: null,
    };
  }, [initialData, livestockId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MilkingFormData>({
    resolver: zodResolver(milkingFormSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  // Resetear el formulario al abrir o cambiar datos iniciales
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: MilkingFormData) => {
    if (isEdit && initialData) {
      updateMilking(
        { id: initialData.id, formData: data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createMilking(data, {
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
    femaleOptions,
    technicianOptions,
    milkingTypes,
    onSubmit,
  };
}
