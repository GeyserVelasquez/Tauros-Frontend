"use client";

import { Controller, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { LivestockFormData } from "../../types";

interface StepStatusProps {
  register: UseFormRegister<LivestockFormData>;
  control: Control<LivestockFormData>;
  errors: FieldErrors<LivestockFormData>;
  entryCauses: { id: number; name: string }[];
  states: { id: number; name: string }[];
}

export function StepStatus({
  register,
  control,
  errors,
  entryCauses,
  states,
}: StepStatusProps) {
  return (
    <>
      <div className="flex gap-8">
        <Field className="flex-1">
          <FieldLabel htmlFor="is_alive">¿Está Vivo?</FieldLabel>
          <FieldContent className="flex items-center">
            <Controller
              name="is_alive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_alive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldDescription className="ml-3 mt-0">
              Indica si el animal se encuentra vivo actualmente.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field className="flex-1">
          <FieldLabel htmlFor="is_enabled">Habilitado para Producción</FieldLabel>
          <FieldContent className="flex items-center">
            <Controller
              name="is_enabled"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_enabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldDescription className="ml-3 mt-0">
              Define si el animal está activo para ordeño u otras tareas.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>

      <Field data-invalid={!!errors.entry_cause_id}>
        <FieldLabel>Causa de Ingreso *</FieldLabel>
        <FieldContent>
          <Controller
            name="entry_cause_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || null}
                onChange={field.onChange}
                options={entryCauses}
                placeholder="Seleccionar Causa de Ingreso..."
              />
            )}
          />
          <FieldError errors={[errors.entry_cause_id]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.state_id}>
        <FieldLabel>Estado Productivo/Salud *</FieldLabel>
        <FieldContent>
          <Controller
            name="state_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || null}
                onChange={field.onChange}
                options={states}
                placeholder="Seleccionar Estado..."
              />
            )}
          />
          <FieldError errors={[errors.state_id]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={!!errors.birth_date}>
          <FieldLabel htmlFor="birth_date">Fecha de Nacimiento</FieldLabel>
          <FieldContent>
            <Input
              id="birth_date"
              type="date"
              {...register("birth_date")}
              aria-invalid={!!errors.birth_date}
            />
            <FieldError errors={[errors.birth_date]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.entry_date}>
          <FieldLabel htmlFor="entry_date">Fecha de Ingreso al Rancho</FieldLabel>
          <FieldContent>
            <Input
              id="entry_date"
              type="date"
              {...register("entry_date")}
              aria-invalid={!!errors.entry_date}
            />
            <FieldError errors={[errors.entry_date]} />
          </FieldContent>
        </Field>
      </div>
    </>
  );
}
