"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clinicDiagnosticFormSchema, ClinicDiagnosticFormData, ClinicDiagnostic } from "../types";
import { useCreateClinicDiagnostic, useUpdateClinicDiagnostic } from "./useClinicDiagnostics";

interface UseClinicDiagnosticFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClinicDiagnostic;
}

export function useClinicDiagnosticForm({
  open,
  onOpenChange,
  initialData,
}: UseClinicDiagnosticFormProps) {
  const isEdit = !!initialData;

  const { mutate: createDiagnostic, isPending: isCreating } = useCreateClinicDiagnostic();
  const { mutate: updateDiagnostic, isPending: isUpdating } = useUpdateClinicDiagnostic();
  const isPending = isCreating || isUpdating;

  // Convert key-value attributes object to array of { key, value } for useFieldArray
  const defaultValues = useMemo<Partial<ClinicDiagnosticFormData>>(() => {
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
  } = useForm<ClinicDiagnosticFormData>({
    resolver: zodResolver(clinicDiagnosticFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when opening or changing initialData
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: ClinicDiagnosticFormData) => {
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
      updateDiagnostic(
        { id: initialData.id, formData: payload },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createDiagnostic(payload, {
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
