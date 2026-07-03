"use client";

import { Controller, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { LivestockFormData } from "../../types";

interface StepAttributesProps {
  register: UseFormRegister<LivestockFormData>;
  control: Control<LivestockFormData>;
  errors: FieldErrors<LivestockFormData>;
  breeds: { id: number; name: string }[];
  colors: { id: number; name: string }[];
  classifications: { id: number; name: string }[];
}

export function StepAttributes({
  register,
  control,
  errors,
  breeds,
  colors,
  classifications,
}: StepAttributesProps) {
  return (
    <>
      <Field data-invalid={!!errors.tits}>
        <FieldLabel htmlFor="tits">Cantidad de Tetas *</FieldLabel>
        <FieldContent>
          <Input
            id="tits"
            type="number"
            min="0"
            {...register("tits", { valueAsNumber: true })}
            aria-invalid={!!errors.tits}
          />
          <FieldError errors={[errors.tits]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.breed_id}>
        <FieldLabel>Raza</FieldLabel>
        <FieldContent>
          <Controller
            name="breed_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={breeds}
                placeholder="Seleccionar Raza..."
              />
            )}
          />
          <FieldError errors={[errors.breed_id]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.color_id}>
        <FieldLabel>Color</FieldLabel>
        <FieldContent>
          <Controller
            name="color_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={colors}
                placeholder="Seleccionar Color..."
              />
            )}
          />
          <FieldError errors={[errors.color_id]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.classification_id}>
        <FieldLabel>Clasificación</FieldLabel>
        <FieldContent>
          <Controller
            name="classification_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={classifications}
                placeholder="Seleccionar Clasificación..."
              />
            )}
          />
          <FieldError errors={[errors.classification_id]} />
        </FieldContent>
      </Field>
    </>
  );
}
