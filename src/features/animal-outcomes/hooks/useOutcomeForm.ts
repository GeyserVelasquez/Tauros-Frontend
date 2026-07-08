"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { outcomeFormSchema, OutcomeFormData } from "../types";
import { useDeathCauses } from "./useOutcomes";
import { useCreateAnimalOutcome } from "./useMutateOutcomes";

interface UseOutcomeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
}

export function useOutcomeForm({
  open,
  onOpenChange,
  livestockId,
}: UseOutcomeFormProps) {
  // Catálogos
  const { data: deathCauses = [], isLoading: isLoadingCauses } = useDeathCauses();
  
  // Listado de ganado activo
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createOutcome, isPending } = useCreateAnimalOutcome();

  // Mapear los animales activos y vivos
  const livestockOptions = useMemo(() => {
    return livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled)
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));
  }, [livestockList]);

  // Mapear causas de muerte
  const deathCauseOptions = useMemo(() => {
    return deathCauses.map((c) => ({ id: c.id, name: c.name }));
  }, [deathCauses]);

  // Valores por defecto
  const defaultValues = useMemo<Partial<OutcomeFormData>>(() => {
    return {
      livestock_id: livestockId || undefined,
      outcome_type: undefined,
      made_at: new Date().toISOString().split("T")[0],
      death_cause_id: null,
    };
  }, [livestockId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OutcomeFormData>({
    resolver: zodResolver(outcomeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Escuchar el tipo de salida seleccionado para reaccionar condicionalmente en la UI
  const outcomeType = watch("outcome_type");

  // Limpiar la causa de muerte si el tipo de salida deja de ser muerte (deceso)
  useEffect(() => {
    if (outcomeType !== "death") {
      setValue("death_cause_id", null);
    }
  }, [outcomeType, setValue]);

  // Reiniciar formulario al abrir/cerrar
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: OutcomeFormData) => {
    createOutcome(data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const isFormLoading = isLoadingCauses || isLoadingLivestock;

  return {
    isFormLoading,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    outcomeType,
    livestockOptions,
    deathCauseOptions,
    onSubmit,
  };
}
