"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { LivestockFormData } from "../../types";

interface StepCommentsProps {
  register: UseFormRegister<LivestockFormData>;
  errors: FieldErrors<LivestockFormData>;
}

export function StepComments({ register, errors }: StepCommentsProps) {
  return (
    <Field data-invalid={!!errors.general_comment}>
      <FieldLabel htmlFor="general_comment">Comentarios Generales</FieldLabel>
      <FieldContent>
        <Textarea
          id="general_comment"
          placeholder="Ingrese detalles sobre el historial del animal, condiciones especiales, etc."
          className="min-h-[150px]"
          {...register("general_comment")}
        />
        <FieldError errors={[errors.general_comment]} />
      </FieldContent>
    </Field>
  );
}
