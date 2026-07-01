"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { ChevronLeft, ChevronRight, Save, Loader2, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { SearchableSelect } from "@/features/livestock/components/searchable-select";
import { useBirthWizardForm } from "../hooks/useBirthWizardForm";
import { Birth, BirthWizardData } from "../types";

// Constant options for newborn categories
export const NEWBORN_CATEGORY_OPTIONS = [
  { id: "heifer_calf", name: "Hembra (Becerra)" },
  { id: "bull_calf", name: "Macho (Becerro)" },
];

interface BirthWizardFormProps {
  initialData?: Birth;
  onSubmit: (data: BirthWizardData) => void;
  isPending: boolean;
}

export function BirthWizardForm({
  initialData,
  onSubmit,
  isPending,
}: BirthWizardFormProps) {
  const isEdit = !!initialData;

  const {
    step,
    methods,
    fields,
    handleNext,
    handleBack,
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
  } = useBirthWizardForm({ initialData });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = methods;

  // Local state to track which newborn cards have their details expanded
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  // Local state to track manually touched/edited inputs to prevent premature errors in Step 2
  const [touchedFieldsLocal, setTouchedFieldsLocal] = useState<Record<string, boolean>>({});

  // Reset local touched fields when going back to Step 1 or on load
  useEffect(() => {
    if (step === 1) {
      setTouchedFieldsLocal({});
    }
  }, [step]);

  const toggleCardExpansion = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isFormLoading) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border bg-card p-8 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Cargando catálogos...</p>
      </div>
    );
  }

  // Render Step 1: General Birth Details
  const renderStep1 = (
    <FieldGroup className="space-y-6">
      {/* Vaca Madre */}
      <Field data-invalid={!!errors.mother_id}>
        <FieldLabel>Hembra (Madre) *</FieldLabel>
        <FieldContent>
          <Controller
            name="mother_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
                options={femaleOptions}
                placeholder="Seleccionar madre..."
                disabled={isEdit}
                invalid={!!errors.mother_id}
              />
            )}
          />
          <FieldError errors={[errors.mother_id]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Fecha de Parto */}
        <Field data-invalid={!!errors.birth_date}>
          <FieldLabel htmlFor="birth_date">Fecha de Parto *</FieldLabel>
          <FieldContent>
            <Input
              id="birth_date"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              aria-invalid={!!errors.birth_date}
              {...register("birth_date")}
            />
            <FieldError errors={[errors.birth_date]} />
          </FieldContent>
        </Field>

        {/* Fecha de Revisión Postparto */}
        <Field data-invalid={!!errors.postbirth_revision_date}>
          <FieldLabel htmlFor="postbirth_revision_date">Revisión Postparto *</FieldLabel>
          <FieldContent>
            <Input
              id="postbirth_revision_date"
              type="date"
              aria-invalid={!!errors.postbirth_revision_date}
              {...register("postbirth_revision_date")}
            />
            <FieldError errors={[errors.postbirth_revision_date]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Tipo de Parto */}
        <Field data-invalid={!!errors.birth_type_id}>
          <FieldLabel>Tipo de Parto *</FieldLabel>
          <FieldContent>
            <Controller
              name="birth_type_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                  }}
                  options={birthTypes}
                  placeholder="Seleccionar tipo..."
                  invalid={!!errors.birth_type_id}
                />
              )}
            />
            <FieldError errors={[errors.birth_type_id]} />
          </FieldContent>
        </Field>

        {/* Cantidad de crías (Sólo en Creación) */}
        {!isEdit && (
          <Field data-invalid={!!errors.newborns_count}>
            <FieldLabel htmlFor="newborns_count">Cantidad de Crías *</FieldLabel>
            <FieldContent>
              <Input
                id="newborns_count"
                type="number"
                min={1}
                max={3}
                aria-invalid={!!errors.newborns_count}
                {...register("newborns_count", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.newborns_count]} />
            </FieldContent>
          </Field>
        )}
      </div>

      {/* Veterinario / Técnico */}
      <Field data-invalid={!!errors.technician_id}>
        <FieldLabel>Veterinario / Técnico</FieldLabel>
        <FieldContent>
          <Controller
            name="technician_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                onChange={(val) => {
                  field.onChange(val || null);
                  field.onBlur();
                }}
                options={technicians.map((t) => ({ id: t.id, name: t.name }))}
                placeholder="Seleccionar veterinario..."
                invalid={!!errors.technician_id}
              />
            )}
          />
          <FieldError errors={[errors.technician_id]} />
        </FieldContent>
      </Field>
    </FieldGroup>
  );

  // Render Step 2: Newborn Specific Configurations
  const renderStep2 = (
    <div className="space-y-6">
      {fields.map((field, index) => {
        // Validation displays only if local field is touched OR form is submitted
        const brandNumberError =
          (touchedFieldsLocal[`newborns.${index}.brand_number`] || isSubmitted)
            ? errors.newborns?.[index]?.brand_number
            : undefined;

        const categoryError =
          (touchedFieldsLocal[`newborns.${index}.animal_category`] || isSubmitted)
            ? errors.newborns?.[index]?.animal_category
            : undefined;

        const newbornTypeError =
          (touchedFieldsLocal[`newborns.${index}.newborn_type_id`] || isSubmitted)
            ? errors.newborns?.[index]?.newborn_type_id
            : undefined;

        const stateError =
          (touchedFieldsLocal[`newborns.${index}.state_id`] || isSubmitted)
            ? errors.newborns?.[index]?.state_id
            : undefined;

        const entryCauseError =
          (touchedFieldsLocal[`newborns.${index}.entry_cause_id`] || isSubmitted)
            ? errors.newborns?.[index]?.entry_cause_id
            : undefined;

        const isOpen = !!expandedCards[index];

        return (
          <div key={field.id} className="rounded-xl border bg-card p-5 flex flex-col gap-5 shadow-sm">
            <h3 className="text-sm font-semibold border-b pb-2 text-neutral-900 dark:text-neutral-50">
              Datos de la Cría #{index + 1}
            </h3>

            {/* 1. Datos de Identificación Básica */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field data-invalid={!!brandNumberError}>
                <FieldLabel htmlFor={`newborn-brand-${index}`}>Número de Marca / Arete *</FieldLabel>
                <FieldContent>
                  <Input
                    id={`newborn-brand-${index}`}
                    placeholder="Ej: CALF-101"
                    className="uppercase"
                    aria-invalid={!!brandNumberError}
                    {...register(`newborns.${index}.brand_number` as const, {
                      onChange: () => {
                        setTouchedFieldsLocal((prev) => ({
                          ...prev,
                          [`newborns.${index}.brand_number`]: true,
                        }));
                      },
                      onBlur: () => {
                        setTouchedFieldsLocal((prev) => ({
                          ...prev,
                          [`newborns.${index}.brand_number`]: true,
                        }));
                      },
                    })}
                  />
                  <FieldError errors={brandNumberError ? [brandNumberError] : []} />
                </FieldContent>
              </Field>

              {/* Categoría as SearchableSelect to save space */}
              <Field data-invalid={!!categoryError}>
                <FieldLabel>Categoría / Sexo *</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`newborns.${index}.animal_category` as const}
                    render={({ field: catField }) => (
                      <SearchableSelect
                        value={catField.value}
                        onChange={(val) => {
                          catField.onChange(val);
                          setTouchedFieldsLocal((prev) => ({
                            ...prev,
                            [`newborns.${index}.animal_category`]: true,
                          }));
                        }}
                        options={NEWBORN_CATEGORY_OPTIONS}
                        placeholder="Seleccionar categoría..."
                        invalid={!!categoryError}
                      />
                    )}
                  />
                  <FieldError errors={categoryError ? [categoryError] : []} />
                </FieldContent>
              </Field>
            </div>

            {/* 2. Estado de Salud, Causa de Entrada y Tipo de Cría */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field data-invalid={!!newbornTypeError}>
                <FieldLabel>Tipo de Cría *</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`newborns.${index}.newborn_type_id` as const}
                    render={({ field: typeField }) => (
                      <SearchableSelect
                        value={typeField.value}
                        onChange={(val) => {
                          typeField.onChange(val);
                          setTouchedFieldsLocal((prev) => ({
                            ...prev,
                            [`newborns.${index}.newborn_type_id`]: true,
                          }));
                        }}
                        options={newbornTypes}
                        placeholder="Seleccionar tipo..."
                        invalid={!!newbornTypeError}
                      />
                    )}
                  />
                  <FieldError errors={newbornTypeError ? [newbornTypeError] : []} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!stateError}>
                <FieldLabel>Estado Inicial *</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`newborns.${index}.state_id` as const}
                    render={({ field: stateField }) => (
                      <SearchableSelect
                        value={stateField.value}
                        onChange={(val) => {
                          stateField.onChange(val);
                          setTouchedFieldsLocal((prev) => ({
                            ...prev,
                            [`newborns.${index}.state_id`]: true,
                          }));
                        }}
                        options={states}
                        placeholder="Seleccionar estado..."
                        invalid={!!stateError}
                      />
                    )}
                  />
                  <FieldError errors={stateError ? [stateError] : []} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!entryCauseError}>
                <FieldLabel>Causa de Entrada *</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`newborns.${index}.entry_cause_id` as const}
                    render={({ field: causeField }) => (
                      <SearchableSelect
                        value={causeField.value}
                        onChange={(val) => {
                          causeField.onChange(val);
                          setTouchedFieldsLocal((prev) => ({
                            ...prev,
                            [`newborns.${index}.entry_cause_id`]: true,
                          }));
                        }}
                        options={entryCauses}
                        placeholder="Seleccionar causa..."
                        invalid={!!entryCauseError}
                      />
                    )}
                  />
                  <FieldError errors={entryCauseError ? [entryCauseError] : []} />
                </FieldContent>
              </Field>
            </div>

            {/* 3. Panel Colapsable de Detalles Físicos y Observaciones Opcionales */}
            <Collapsible open={isOpen} onOpenChange={() => toggleCardExpansion(index)} className="w-full mt-2">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Detalles Adicionales (Opcional)</span>
                  <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel>Color</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name={`newborns.${index}.color_id` as const}
                        render={({ field: colField }) => (
                          <SearchableSelect
                            value={colField.value || ""}
                            onChange={(val) => colField.onChange(val || null)}
                            options={colors}
                            placeholder="Seleccionar color..."
                          />
                        )}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Raza</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name={`newborns.${index}.breed_id` as const}
                        render={({ field: brField }) => (
                          <SearchableSelect
                            value={brField.value || ""}
                            onChange={(val) => brField.onChange(val || null)}
                            options={breeds}
                            placeholder="Seleccionar raza..."
                          />
                        )}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Padre (Toro)</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name={`newborns.${index}.father_id` as const}
                        render={({ field: faField }) => (
                          <SearchableSelect
                            value={faField.value || ""}
                            onChange={(val) => faField.onChange(val || null)}
                            options={fatherOptions}
                            placeholder="Seleccionar padre..."
                          />
                        )}
                      />
                    </FieldContent>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor={`newborn-chip-${index}`}>Microchip / Código Electrónico</FieldLabel>
                    <FieldContent>
                      <Input
                        id={`newborn-chip-${index}`}
                        placeholder="Ej: 982000001..."
                        {...register(`newborns.${index}.electronic_code` as const)}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`newborn-name-${index}`}>Nombre de la Cría</FieldLabel>
                    <FieldContent>
                      <Input
                        id={`newborn-name-${index}`}
                        placeholder="Ej: Lucerito"
                        {...register(`newborns.${index}.name` as const)}
                      />
                    </FieldContent>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor={`newborn-comment-${index}`}>Observaciones</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id={`newborn-comment-${index}`}
                      placeholder="Comentarios u observaciones especiales de la cría..."
                      className="resize-none h-20"
                      {...register(`newborns.${index}.general_comment` as const)}
                    />
                  </FieldContent>
                </Field>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-card p-6 shadow-sm font-montserrat">
      {/* Progress Dots Indicator */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2].map((s) => (
          <div key={s} className="flex flex-1 items-center">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                step === s
                  ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                  : step > s
                  ? "bg-muted-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 2 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                  step > s ? "bg-muted-foreground" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step titles */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {step === 1 && (isEdit ? "Editar Parto: Datos Generales" : "Paso 1: Registro del Parto")}
          {step === 2 && (isEdit ? "Editar Parto: Datos de las Crías" : "Paso 2: Registro de Crías")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === 1 && "Ingrese los datos principales de la madre y del parto."}
          {step === 2 && "Complete la información de los recién nacidos vinculados a este parto."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="min-h-[300px]">
          {step === 1 ? renderStep1 : renderStep2}
        </FieldGroup>

        {/* Step navigation actions */}
        <div className="mt-8 flex justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={step === 1 ? () => window.history.back() : handleBack}
            disabled={isPending}
            className="active:scale-95 transition-transform"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>

          {step === 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="active:scale-95 transition-transform"
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Guardar Cambios" : "Guardar Registro"}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
