import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { birthFlatSchema, BirthFlatFormData, Birth } from "../types";
import { useEntryCauses } from "@/features/entry-causes";
import { useStates } from "@/features/states";
import { useColors } from "@/features/colors";
import { useBreeds } from "@/features/breeds";
import { useTechnicians } from "@/features/technicians";
import { useBirthTypes, useNewbornTypes } from "./useBirths";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";

interface UseBirthWizardFormProps {
  initialData?: Birth;
}

export function useBirthWizardForm({ initialData }: UseBirthWizardFormProps = {}) {
  const isEdit = !!initialData;

  // Load catalogs from standard hooks
  const { data: birthTypes = [], isLoading: isLoadingBirthTypes } = useBirthTypes();
  const { data: newbornTypes = [], isLoading: isLoadingNewbornTypes } = useNewbornTypes();
  const { data: entryCauses = [], isLoading: isLoadingCauses } = useEntryCauses();
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: colors = [], isLoading: isLoadingColors } = useColors();
  const { data: breeds = [], isLoading: isLoadingBreeds } = useBreeds();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();

  // Load livestock for relations
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Filter gestating mothers (females)
  const femaleCategories = ["cow", "heifer", "female_yearling", "heifer_calf"];
  const femaleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && femaleCategories.includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData?.mother && !list.some((item) => item.id === initialData.mother_id)) {
      list.push({
        id: initialData.mother_id,
        name: `${initialData.mother.brand_number} ${initialData.mother.name ? `- ${initialData.mother.name}` : ""}`,
      });
    }

    return list;
  }, [livestockList, initialData]);

  // Filter fathers (bulls)
  const fatherOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.animal_category === "bull")
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData?.newborns?.[0]?.livestock?.father) {
      const father = initialData.newborns[0].livestock.father;
      if (!list.some((item) => item.id === father.id)) {
        list.push({
          id: father.id,
          name: `${father.brand_number} ${father.name ? `- ${father.name}` : ""}`,
        });
      }
    }

    return list;
  }, [livestockList, initialData]);

  // Compute flat default values
  const defaultValues: BirthFlatFormData = useMemo(() => {
    const firstNewborn = initialData?.newborns?.[0];

    if (initialData) {
      return {
        mother_id: initialData.mother_id,
        birth_date: initialData.birth_date ? initialData.birth_date.split("T")[0] : "",
        postbirth_revision_date: initialData.postbirth_revision_date ? initialData.postbirth_revision_date.split("T")[0] : "",
        birth_type_id: initialData.birth_type_id,
        technician_id: initialData.technician_id || null,
        // Newborn fields flattened
        brand_number: firstNewborn?.livestock?.brand_number || "",
        animal_category: (firstNewborn?.livestock?.animal_category as any) || undefined,
        entry_cause_id: firstNewborn?.livestock?.entry_cause_id || undefined as any,
        state_id: firstNewborn?.livestock?.state_id || undefined as any,
        newborn_type_id: firstNewborn?.newborn_type_id || undefined as any,
        color_id: firstNewborn?.livestock?.color_id || null,
        breed_id: firstNewborn?.livestock?.breed_id || null,
        father_id: firstNewborn?.livestock?.father_id || null,
        electronic_code: firstNewborn?.livestock?.electronic_code || "",
        name: firstNewborn?.livestock?.name || "",
        general_comment: firstNewborn?.livestock?.general_comment || "",
      };
    }

    return {
      mother_id: undefined as any,
      birth_date: new Date().toISOString().split("T")[0],
      postbirth_revision_date: new Date().toISOString().split("T")[0],
      birth_type_id: undefined as any,
      technician_id: null,
      // Newborn fields empty
      brand_number: "",
      animal_category: undefined as any,
      entry_cause_id: undefined as any,
      state_id: undefined as any,
      newborn_type_id: undefined as any,
      color_id: null,
      breed_id: null,
      father_id: null,
      electronic_code: "",
      name: "",
      general_comment: "",
    };
  }, [initialData]);

  const methods = useForm<BirthFlatFormData>({
    resolver: zodResolver(birthFlatSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const { reset, watch } = methods;

  // Reset form when initialData changes
  useEffect(() => {
    reset(defaultValues);
  }, [initialData, defaultValues, reset]);

  // Load default catalog options into creation mode as soon as they finish loading
  useEffect(() => {
    if (!isEdit && entryCauses.length && states.length && newbornTypes.length) {
      if (!watch("entry_cause_id")) {
        const birthCauseId = entryCauses.find((c: { name: string; id: number }) => c.name.toLowerCase().includes("nacimiento"))?.id || 1;
        const activeStateId = states.find((s: { name: string; id: number }) => s.name.toLowerCase().includes("activo"))?.id || 1;
        const normalTypeId = newbornTypes.find((t) => t.name.toLowerCase().includes("normal"))?.id || 1;

        reset({
          ...watch(),
          entry_cause_id: birthCauseId,
          state_id: activeStateId,
          newborn_type_id: normalTypeId,
        });
      }
    }
  }, [entryCauses, states, newbornTypes, isEdit, reset, watch]);

  const isFormLoading =
    isLoadingBirthTypes ||
    isLoadingNewbornTypes ||
    isLoadingCauses ||
    isLoadingStates ||
    isLoadingColors ||
    isLoadingBreeds ||
    isLoadingTechnicians ||
    isLoadingLivestock;

  return {
    methods,
    isFormLoading,
    birthTypes,
    newbornTypes,
    entryCauses,
    states,
    colors,
    breeds,
    technicians,
    femaleOptions,
    fatherOptions,
  };
}
