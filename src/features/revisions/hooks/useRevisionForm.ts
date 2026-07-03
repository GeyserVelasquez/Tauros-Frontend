"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FEMALE_CATEGORIES } from "@/features/livestock";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { useTechnicians } from "@/features/technicians";
import { revisionFormSchema, RevisionFormData, Revision } from "../types";
import { useRevisionTypes } from "./useRevisions";
import { useCreateRevision, useUpdateRevision } from "./useMutateRevisions";

interface UseRevisionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
  initialData?: Revision;
}

export function useRevisionForm({
  open,
  onOpenChange,
  livestockId,
  initialData,
}: UseRevisionFormProps) {
  const isEdit = !!initialData;

  // Catálogos
  const { data: revisionTypes = [], isLoading: isLoadingTypes } = useRevisionTypes();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();
  
  // Ganado hembra
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createRevision, isPending: isCreating } = useCreateRevision();
  const { mutate: updateRevision, isPending: isUpdating } = useUpdateRevision();
  const isPending = isCreating || isUpdating;

  // Filtrado de hembras
  const femaleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && FEMALE_CATEGORIES.includes(animal.animal_category))
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
  const defaultValues = useMemo<Partial<RevisionFormData>>(() => {
    if (initialData) {
      return {
        livestock_id: initialData.livestock_id,
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        revision_result: initialData.revision_result,
        revision_type_id: initialData.revision_type_id,
        technician_id: initialData.technician_id,
      };
    }
    return {
      livestock_id: livestockId || undefined,
      made_at: new Date().toISOString().split("T")[0],
      revision_result: "empty",
      revision_type_id: undefined,
      technician_id: null,
    };
  }, [initialData, livestockId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RevisionFormData>({
    resolver: zodResolver(revisionFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reiniciar el formulario al abrir/cerrar o cambiar datos iniciales
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: RevisionFormData) => {
    if (isEdit && initialData) {
      updateRevision(
        { id: initialData.id, formData: data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createRevision(data, {
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
    revisionTypes,
    onSubmit,
  };
}
