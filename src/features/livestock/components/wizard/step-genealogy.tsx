"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { LivestockFormData } from "../../types";

interface StepGenealogyProps {
  control: Control<LivestockFormData>;
  errors: FieldErrors<LivestockFormData>;
  owners: { id: number; name: string }[];
  technicians: { id: number; name: string }[];
  livestockOptions: { id: number; name: string }[];
}

export function StepGenealogy({
  control,
  errors,
  owners,
  technicians,
  livestockOptions,
}: StepGenealogyProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={!!errors.owner_id}>
          <FieldLabel>Propietario</FieldLabel>
          <FieldContent>
            <Controller
              name="owner_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={owners}
                  placeholder="Seleccionar Propietario..."
                />
              )}
            />
            <FieldError errors={[errors.owner_id]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.technician_id}>
          <FieldLabel>Médico Veterinario</FieldLabel>
          <FieldContent>
            <Controller
              name="technician_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={technicians}
                  placeholder="Seleccionar Veterinario..."
                />
              )}
            />
            <FieldError errors={[errors.technician_id]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={!!errors.father_id}>
          <FieldLabel>Padre (Toro)</FieldLabel>
          <FieldContent>
            <Controller
              name="father_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={livestockOptions}
                  placeholder="Buscar Padre..."
                />
              )}
            />
            <FieldError errors={[errors.father_id]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.mother_id}>
          <FieldLabel>Madre Biológica (Vaca)</FieldLabel>
          <FieldContent>
            <Controller
              name="mother_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={livestockOptions}
                  placeholder="Buscar Madre..."
                />
              )}
            />
            <FieldError errors={[errors.mother_id]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={!!errors.adoptive_mother_id}>
          <FieldLabel>Madre Adoptiva</FieldLabel>
          <FieldContent>
            <Controller
              name="adoptive_mother_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={livestockOptions}
                  placeholder="Buscar Madre Adoptiva..."
                />
              )}
            />
            <FieldError errors={[errors.adoptive_mother_id]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.receiving_mother_id}>
          <FieldLabel>Receptora de Embrión</FieldLabel>
          <FieldContent>
            <Controller
              name="receiving_mother_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={livestockOptions}
                  placeholder="Buscar Receptora..."
                />
              )}
            />
            <FieldError errors={[errors.receiving_mother_id]} />
          </FieldContent>
        </Field>
      </div>
    </>
  );
}
