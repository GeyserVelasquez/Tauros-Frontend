import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";
import { useClinicDiagnosticsList } from "@/features/clinic-diagnostics/hooks/useClinicDiagnostics";
import { useClinicalTreatmentsList } from "@/features/clinical-treatments/hooks/useClinicalTreatments";
import { useSupplies } from "@/features/supplies/hooks/useSupplies";
import { useTechnicians } from "@/features/technicians/hooks/useTechnicians";
import { clinicHistoryFormSchema, ClinicHistoryFormData, ClinicHistory } from "../types";

interface UseClinicHistoryWizardFormProps {
  initialData?: ClinicHistory;
}

export function useClinicHistoryWizardForm({ initialData }: UseClinicHistoryWizardFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Fetch dependency lists
  const { data: livestockData, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 200 });
  const { data: diagnosticsData, isLoading: isLoadingDiagnostics } = useClinicDiagnosticsList({ per_page: 200 });
  const { data: treatmentsData, isLoading: isLoadingTreatments } = useClinicalTreatmentsList({ per_page: 200 });
  const { data: suppliesData, isLoading: isLoadingSupplies } = useSupplies();
  const { data: techniciansData, isLoading: isLoadingTechnicians } = useTechnicians();

  const isDataLoading =
    isLoadingLivestock ||
    isLoadingDiagnostics ||
    isLoadingTreatments ||
    isLoadingSupplies ||
    isLoadingTechnicians;

  // Map option structures for SearchableSelect
  const livestockOptions = useMemo(() => {
    return (livestockData?.data || []).map((l: any) => ({
      id: l.id,
      name: `${l.brand_number} - ${l.name}`,
    }));
  }, [livestockData]);

  const diagnosticOptions = useMemo(() => {
    return (diagnosticsData?.data || []).map((d) => ({
      id: d.id,
      name: `${d.code} - ${d.name}`,
    }));
  }, [diagnosticsData]);

  const treatmentOptions = useMemo(() => {
    return (treatmentsData?.data || []).map((t) => ({
      id: t.id,
      name: `${t.code} - ${t.name}`,
    }));
  }, [treatmentsData]);

  const supplyOptions = useMemo(() => {
    return (suppliesData || []).map((s: any) => ({
      id: s.id,
      name: `${s.code} - ${s.name}`,
    }));
  }, [suppliesData]);

  const technicianOptions = useMemo(() => {
    return (techniciansData || []).map((t) => ({
      id: t.id,
      name: t.name,
    }));
  }, [techniciansData]);

  // Set default form values (convert quantity/100 if editing)
  const defaultValues = useMemo<Partial<ClinicHistoryFormData>>(() => {
    if (initialData) {
      return {
        code: initialData.code,
        name: initialData.name,
        description: initialData.description || "",
        livestock_id: String(initialData.livestock_id),
        technician_id: initialData.technician_id ? String(initialData.technician_id) : null,
        diagnostics: (initialData.clinic_diagnostics || []).map((d) => String(d.id)),
        treatments: (initialData.treatment_applications || []).map((app) => ({
          clinical_treatment_id: String(app.clinical_treatment_id),
          supply_id: app.supply_id ? String(app.supply_id) : null,
          quantity: app.quantity / 100, // stored multiplied by 100 in db
          is_recurring: app.dose_number !== null,
          frequency_hours: undefined, // recurrences aren't easily editable directly this way, reset or defaults
          total_doses: undefined,
        })),
      };
    }

    return {
      code: "",
      name: "",
      description: "",
      livestock_id: "",
      technician_id: null,
      diagnostics: [],
      treatments: [
        {
          clinical_treatment_id: "",
          supply_id: null,
          quantity: 0.1,
          is_recurring: false,
        },
      ],
    };
  }, [initialData]);

  const methods = useForm<ClinicHistoryFormData>({
    resolver: zodResolver(clinicHistoryFormSchema) as any,
    defaultValues,
    mode: "onTouched",
  });

  // Keep form updated with default values when initialData changes
  useEffect(() => {
    if (initialData) {
      methods.reset(defaultValues);
    }
  }, [initialData, defaultValues, methods]);

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof ClinicHistoryFormData> = [];
    if (currentStep === 1) {
      fieldsToValidate = ["code", "name", "description", "livestock_id", "technician_id"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["diagnostics"];
    }

    const isValid = await methods.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return {
    methods,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    isDataLoading,
    livestockOptions,
    diagnosticOptions,
    treatmentOptions,
    supplyOptions,
    technicianOptions,
  };
}
