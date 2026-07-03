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
import { LivestockFormData, ANIMAL_CATEGORY_OPTIONS } from "../../types";

interface StepBasicInfoProps {
  register: UseFormRegister<LivestockFormData>;
  control: Control<LivestockFormData>;
  errors: FieldErrors<LivestockFormData>;
}

export function StepBasicInfo({ register, control, errors }: StepBasicInfoProps) {
  return (
    <>
      <Field data-invalid={!!errors.brand_number}>
        <FieldLabel htmlFor="brand_number">Número de Marca / Arete *</FieldLabel>
        <FieldContent>
          <Input
            id="brand_number"
            placeholder="Ej: MARCA-102"
            className="uppercase"
            {...register("brand_number")}
            aria-invalid={!!errors.brand_number}
          />
          <FieldError errors={[errors.brand_number]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.electronic_code}>
        <FieldLabel htmlFor="electronic_code">Código Electrónico / Chip</FieldLabel>
        <FieldContent>
          <Input
            id="electronic_code"
            placeholder="Ej: RFID900123"
            {...register("electronic_code")}
            aria-invalid={!!errors.electronic_code}
          />
          <FieldError errors={[errors.electronic_code]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nombre del Animal</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej: Clementina"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.animal_category}>
        <FieldLabel>Categoría *</FieldLabel>
        <FieldContent>
          <Controller
            name="animal_category"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={ANIMAL_CATEGORY_OPTIONS}
                placeholder="Seleccionar Categoría..."
              />
            )}
          />
          <FieldError errors={[errors.animal_category]} />
        </FieldContent>
      </Field>
    </>
  );
}
