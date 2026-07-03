"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { livestockFormSchema, LivestockFormData, Livestock } from "../types";
import { useBreeds } from "@/features/breeds";
import { useColors } from "@/features/colors";
import { useClassifications } from "@/features/classifications";
import { useEntryCauses } from "@/features/entry-causes";
import { useStates } from "@/features/states";
import { useOwners } from "@/features/owners";
import { useTechnicians } from "@/features/technicians";
import { useLivestockList } from "./useLivestock";

interface UseLivestockWizardFormProps {
  initialData?: Livestock;
  onSubmit: (data: LivestockFormData) => void;
}

export function useLivestockWizardForm({
  initialData,
  onSubmit,
}: UseLivestockWizardFormProps) {
  const [step, setStep] = useState<number>(1);

  // Carga de catálogos
  const { data: breeds = [], isLoading: isLoadingBreeds } = useBreeds();
  const { data: colors = [], isLoading: isLoadingColors } = useColors();
  const { data: classifications = [], isLoading: isLoadingClassifications } = useClassifications();
  const { data: entryCauses = [], isLoading: isLoadingCauses } = useEntryCauses();
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: owners = [], isLoading: isLoadingOwners } = useOwners();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();
  
  // Carga de opciones de ganado para genealogía (filtrado por categorías adultas/aptas)
  const { data: livestockResponse } = useLivestockList({
    per_page: 1000,
    animal_category: ["bull", "steer", "cow", "heifer"],
  });
  const rawLivestock = livestockResponse?.data || [];

  // Mapear y filtrar padres (toros/novillos)
  const fatherOptions = useMemo(() => {
    const list = rawLivestock
      .filter((animal) => ["bull", "steer"].includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData?.father && !list.some((item) => item.id === initialData.father_id)) {
      list.push({
        id: initialData.father.id,
        name: `${initialData.father.brand_number} ${initialData.father.name ? `- ${initialData.father.name}` : ""}`,
      });
    }
    return list;
  }, [rawLivestock, initialData]);

  // Mapear y filtrar madres (vacas/novillas)
  const motherOptions = useMemo(() => {
    const list = rawLivestock
      .filter((animal) => ["cow", "heifer"].includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData) {
      const extraMothers = [
        initialData.mother,
        initialData.adoptive_mother,
        initialData.receiving_mother,
      ].filter(Boolean) as Livestock[];

      extraMothers.forEach((extra) => {
        if (!list.some((item) => item.id === extra.id)) {
          list.push({
            id: extra.id,
            name: `${extra.brand_number} ${extra.name ? `- ${extra.name}` : ""}`,
          });
        }
      });
    }
    return list;
  }, [rawLivestock, initialData]);

  const defaultData = useMemo(() => ({
    brand_number: initialData?.brand_number || "",
    electronic_code: initialData?.electronic_code || "",
    name: initialData?.name || "",
    birth_date: initialData?.birth_date || "",
    entry_date: initialData?.entry_date || "",
    general_comment: initialData?.general_comment || "",
    tits: initialData?.tits !== undefined ? initialData.tits : 0,
    is_enabled: initialData?.is_enabled !== undefined ? initialData.is_enabled : true,
    is_alive: initialData?.is_alive !== undefined ? initialData.is_alive : true,
    animal_category: initialData?.animal_category || "",
    entry_cause_id: initialData?.entry_cause_id || 0,
    state_id: initialData?.state_id || 0,
    breed_id: initialData?.breed_id || null,
    color_id: initialData?.color_id || null,
    classification_id: initialData?.classification_id || null,
    owner_id: initialData?.owner_id || null,
    technician_id: initialData?.technician_id || null,
    father_id: initialData?.father_id || null,
    mother_id: initialData?.mother_id || null,
    adoptive_mother_id: initialData?.adoptive_mother_id || null,
    receiving_mother_id: initialData?.receiving_mother_id || null,
  }), [initialData]);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<LivestockFormData>({
    resolver: zodResolver(livestockFormSchema),
    defaultValues: defaultData,
    mode: "onChange",
  });

  // Campos a validar por cada paso
  const stepFields: Record<number, (keyof LivestockFormData)[]> = {
    1: ["brand_number", "electronic_code", "name", "animal_category"],
    2: ["is_alive", "is_enabled", "entry_cause_id", "state_id", "birth_date", "entry_date"],
    3: ["tits", "breed_id", "color_id", "classification_id"],
    4: ["owner_id", "technician_id", "father_id", "mother_id", "adoptive_mother_id", "receiving_mother_id"],
    5: ["general_comment"],
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[step];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const isFormLoading =
    isLoadingBreeds ||
    isLoadingColors ||
    isLoadingClassifications ||
    isLoadingCauses ||
    isLoadingStates ||
    isLoadingOwners ||
    isLoadingTechnicians;

  return {
    step,
    setStep,
    handleNext,
    handleBack,
    isFormLoading,
    register,
    handleSubmit,
    control,
    errors,
    trigger,
    breeds,
    colors,
    classifications,
    entryCauses,
    states,
    owners,
    technicians,
    fatherOptions,
    motherOptions,
  };
}
