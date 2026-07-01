import { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { birthWizardSchema, BirthWizardData, Birth } from "../types";
import { useEntryCauses, useStates, useColors, useBreeds, useTechnicians } from "@/features/livestock/hooks/useDropdownOptions";
import { useBirthTypes, useNewbornTypes } from "./useBirths";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";

interface UseBirthWizardFormProps {
  initialData?: Birth;
}

export function useBirthWizardForm({ initialData }: UseBirthWizardFormProps = {}) {
  const [step, setStep] = useState<number>(1);

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

    if (initialData?.newborns) {
      initialData.newborns.forEach((nb) => {
        const father = nb.livestock?.father;
        if (father && !list.some((item) => item.id === father.id)) {
          list.push({
            id: father.id,
            name: `${father.brand_number} ${father.name ? `- ${father.name}` : ""}`,
          });
        }
      });
    }

    return list;
  }, [livestockList, initialData]);

  // Compute default values
  const defaultValues: BirthWizardData = useMemo(() => {
    if (initialData) {
      return {
        mother_id: initialData.mother_id,
        birth_date: initialData.birth_date ? initialData.birth_date.split("T")[0] : "",
        postbirth_revision_date: initialData.postbirth_revision_date ? initialData.postbirth_revision_date.split("T")[0] : "",
        birth_type_id: initialData.birth_type_id,
        technician_id: initialData.technician_id || null,
        newborns_count: initialData.newborns?.length || 1,
        newborns: initialData.newborns?.map((nb) => ({
          brand_number: nb.livestock?.brand_number || "",
          animal_category: (nb.livestock?.animal_category as any) || undefined,
          entry_cause_id: nb.livestock?.entry_cause_id || undefined as any,
          state_id: nb.livestock?.state_id || undefined as any,
          newborn_type_id: nb.newborn_type_id || undefined as any,
          color_id: nb.livestock?.color_id || null,
          breed_id: nb.livestock?.breed_id || null,
          father_id: nb.livestock?.father_id || null,
          electronic_code: nb.livestock?.electronic_code || "",
          name: nb.livestock?.name || "",
          general_comment: nb.livestock?.general_comment || "",
        })) || [],
      };
    }

    return {
      mother_id: undefined as any,
      birth_date: new Date().toISOString().split("T")[0],
      postbirth_revision_date: new Date().toISOString().split("T")[0],
      birth_type_id: undefined as any,
      technician_id: null,
      newborns_count: 1,
      newborns: [{
        brand_number: "",
        animal_category: undefined as any, // Unselected by default
        entry_cause_id: undefined as any,
        state_id: undefined as any,
        newborn_type_id: undefined as any,
        color_id: null,
        breed_id: null,
        father_id: null,
        electronic_code: "",
        name: "",
        general_comment: "",
      }],
    };
  }, [initialData]);

  const methods = useForm<BirthWizardData>({
    resolver: zodResolver(birthWizardSchema),
    defaultValues,
    mode: "onChange",
  });

  const { control, trigger, watch, reset } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "newborns" });
  const watchNewbornsCount = watch("newborns_count") || 1;

  // Reset form when initialData changes
  useEffect(() => {
    reset(defaultValues);
    setStep(1);
  }, [initialData, defaultValues, reset]);

  const syncNewbornsArray = (count: number) => {
    const currentLength = fields.length;
    const birthCauseId = entryCauses.find((c) => c.name.toLowerCase().includes("nacimiento"))?.id || 1;
    const activeStateId = states.find((s) => s.name.toLowerCase().includes("activo"))?.id || 1;
    const normalTypeId = newbornTypes.find((t) => t.name.toLowerCase().includes("normal"))?.id || 1;

    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        append({
          brand_number: "",
          animal_category: undefined as any, // Not selected by default
          entry_cause_id: birthCauseId,
          state_id: activeStateId,
          newborn_type_id: normalTypeId,
          color_id: null,
          breed_id: null,
          father_id: null,
          electronic_code: "",
          name: "",
          general_comment: "",
        });
      }
    } else if (count < currentLength) {
      for (let i = currentLength - 1; i >= count; i--) {
        remove(i);
      }
    }
  };

  const handleNext = async () => {
    const isStep1Valid = await trigger([
      "mother_id",
      "birth_date",
      "postbirth_revision_date",
      "birth_type_id",
      "technician_id",
      "newborns_count",
    ]);

    if (isStep1Valid) {
      syncNewbornsArray(watchNewbornsCount);
      setStep(2);
    }
  };

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
    step,
    methods,
    fields,
    handleNext,
    handleBack: () => setStep(1),
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
