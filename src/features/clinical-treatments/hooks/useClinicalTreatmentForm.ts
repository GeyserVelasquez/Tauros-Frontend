"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clinicalTreatmentFormSchema, ClinicalTreatmentFormData, ClinicalTreatment } from "../types";
import { useCreateClinicalTreatment, useUpdateClinicalTreatment } from "./useClinicalTreatments";

interface UseClinicalTreatmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClinicalTreatment;
}

export function useClinicalTreatmentForm({
  open,
  onOpenChange,
  initialData,
}: UseClinicalTreatmentFormProps) {
  const isEdit = !!initialData;

  const { mutate: createTreatment, isPending: isCreating } = useCreateClinicalTreatment();
  const { mutate: updateTreatment, isPending: isUpdating } = useUpdateClinicalTreatment();
  const isPending = isCreating || isUpdating;

  // Convert key-value attributes object to array of { key, value } for useFieldArray
  const defaultValues = useMemo<Partial<ClinicalTreatmentFormData>>(() => {
    if (initialData) {
      const attributesArray = initialData.attributes
        ? Object.entries(initialData.attributes).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [];

      return {
        code: initialData.code,
        name: initialData.name,
        attributes: attributesArray,
      };
    }

    return {
      code: "",
      name: "",
      attributes: [],
    };
  }, [initialData]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ClinicalTreatmentFormData>({
    resolver: zodResolver(clinicalTreatmentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when opening or changing initialData
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: ClinicalTreatmentFormData) => {
    // Convert attributes array back to key-value object
    const attributesObject = data.attributes.reduce<Record<string, string>>((acc, curr) => {
      if (curr.key.trim()) {
        acc[curr.key.trim()] = curr.value;
      }
      return acc;
    }, {});

    const payload = {
      code: data.code,
      name: data.name,
      attributes: attributesObject,
    };

    if (isEdit && initialData) {
      updateTreatment(
        { id: initialData.id, formData: payload },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createTreatment(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return {
    isEdit,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
  };
}
