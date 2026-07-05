"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { StepIndicator } from "@/components/ui/step-indicator";
import { StepNavigation } from "@/components/ui/step-navigation";
import { useClinicHistoryWizardForm } from "../hooks/useClinicHistoryWizardForm";
import { ClinicHistory, ClinicHistoryFormData } from "../types";

interface ClinicHistoryWizardFormProps {
  initialData?: ClinicHistory;
  onSubmit: (data: ClinicHistoryFormData) => void;
  isPending: boolean;
}

export function ClinicHistoryWizardForm({
  initialData,
  onSubmit,
  isPending,
}: ClinicHistoryWizardFormProps) {
  const isEdit = !!initialData;

  const {
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
  } = useClinicHistoryWizardForm({ initialData });

  const { control, handleSubmit, register, formState: { errors } } = methods;

  const { fields: treatmentFields, append: appendTreatment, remove: removeTreatment } = useFieldArray({
    control,
    name: "treatments",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleFormSubmit = (data: ClinicHistoryFormData) => {
    onSubmit(data);
  };

  const filteredDiagnostics = diagnosticOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-card p-6 shadow-sm font-montserrat">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {isEdit ? "Editar Consulta Médica" : "Nueva Consulta Médica"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Complete los diagnósticos y tratamientos veterinarios prescritos.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit as any)}>
        <div className="space-y-6 min-h-[400px]">
          {/* STEP INDICATOR */}
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} className="mb-6 justify-center" />

          {isDataLoading ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando catálogos y dependencias...</p>
            </div>
          ) : (
            <>
              {/* PASO 1: Identificación y Datos Generales */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    1. Datos Generales de la Consulta
                  </h3>
                  <FieldGroup className="space-y-4">
                    {/* Código de Consulta */}
                    <Field data-invalid={!!errors.code}>
                      <FieldLabel htmlFor="code">Código de Consulta *</FieldLabel>
                      <FieldContent>
                        <Input
                          id="code"
                          placeholder="Ej: HC-001"
                          disabled={isEdit || isPending}
                          {...register("code")}
                        />
                        <FieldError errors={[errors.code]} />
                      </FieldContent>
                    </Field>

                    {/* Título de Consulta */}
                    <Field data-invalid={!!errors.name}>
                      <FieldLabel htmlFor="name">Título / Motivo *</FieldLabel>
                      <FieldContent>
                        <Input
                          id="name"
                          placeholder="Ej: Chequeo Mastitis, Vacunación Inicial"
                          disabled={isPending}
                          {...register("name")}
                        />
                        <FieldError errors={[errors.name]} />
                      </FieldContent>
                    </Field>

                    {/* Animal */}
                    <Controller
                      name="livestock_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                          <FieldLabel>Ganado / Animal *</FieldLabel>
                          <FieldContent>
                            <SearchableSelect
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val);
                                field.onBlur();
                              }}
                              options={livestockOptions}
                              placeholder="Seleccionar animal..."
                              disabled={isEdit}
                              invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    {/* Veterinario / Técnico */}
                    <Controller
                      name="technician_id"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                          <FieldLabel>Veterinario / Técnico</FieldLabel>
                          <FieldContent>
                            <SearchableSelect
                              value={field.value || ""}
                              onChange={(val) => {
                                field.onChange(val || null);
                                field.onBlur();
                              }}
                              options={technicianOptions}
                              placeholder="Seleccionar técnico encargado..."
                              invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    {/* Notas / Descripción */}
                    <Field data-invalid={!!errors.description}>
                      <FieldLabel htmlFor="description">Descripción / Notas Adicionales</FieldLabel>
                      <FieldContent>
                        <Textarea
                          id="description"
                          placeholder="Escriba síntomas observados, recomendaciones clínicas..."
                          disabled={isPending}
                          rows={3}
                          {...register("description")}
                        />
                        <FieldError errors={[errors.description]} />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </div>
              )}

              {/* PASO 2: Diagnósticos */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    2. Seleccionar Diagnósticos
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Seleccione una o más enfermedades o condiciones clínicas diagnosticadas en esta consulta.
                  </p>

                  <Controller
                    name="diagnostics"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-3">
                        <Input
                          type="search"
                          placeholder="Filtrar diagnósticos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                        <div className="border rounded-md max-h-[250px] overflow-y-auto p-2 space-y-1">
                          {filteredDiagnostics.length === 0 ? (
                            <p className="text-xs text-center text-muted-foreground py-4">No se encontraron diagnósticos.</p>
                          ) : (
                            filteredDiagnostics.map((diag) => {
                              const isChecked = field.value?.includes(String(diag.id));
                              return (
                                <label
                                  key={diag.id}
                                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      const currentValues = field.value || [];
                                      const newValues = isChecked
                                        ? currentValues.filter((v) => v !== String(diag.id))
                                        : [...currentValues, String(diag.id)];
                                      field.onChange(newValues);
                                      field.onBlur();
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <span>{diag.name}</span>
                                </label>
                              );
                            })
                          )}
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </div>
                    )}
                  />
                </div>
              )}

              {/* PASO 3: Tratamientos e Insumos */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      3. Prescribir Tratamientos
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTreatment({ clinical_treatment_id: "", supply_id: null, quantity: 0.1, is_recurring: false, first_dose_date: new Date().toISOString().split("T")[0], is_first_dose_applied: true })}
                      className="flex items-center gap-1 h-8 text-xs active:scale-95 transition-transform"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Añadir Tratamiento
                    </Button>
                  </div>

                  {errors.treatments && (
                    <div className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
                      Corrija las dosis o agregue al menos un tratamiento para poder guardar.
                    </div>
                  )}

                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    {treatmentFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900/50 space-y-3 relative border-neutral-200 dark:border-neutral-800"
                      >
                        {treatmentFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTreatment(index)}
                            className="absolute right-2 top-2 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {/* Tratamiento */}
                          <Controller
                            name={`treatments.${index}.clinical_treatment_id` as const}
                            control={control}
                            render={({ field: subField, fieldState }) => (
                              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                                <FieldLabel>Tratamiento *</FieldLabel>
                                <FieldContent>
                                  <SearchableSelect
                                    value={subField.value}
                                    onChange={(val) => {
                                      subField.onChange(val);
                                      subField.onBlur();
                                    }}
                                    options={treatmentOptions}
                                    placeholder="Elegir tratamiento..."
                                    invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                              </Field>
                            )}
                          />

                          {/* Insumo */}
                          <Controller
                            name={`treatments.${index}.supply_id` as const}
                            control={control}
                            render={({ field: subField, fieldState }) => (
                              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                                <FieldLabel>Insumo / Medicamento</FieldLabel>
                                <FieldContent>
                                  <SearchableSelect
                                    value={subField.value || ""}
                                    onChange={(val) => {
                                      subField.onChange(val || null);
                                      subField.onBlur();
                                    }}
                                    options={supplyOptions}
                                    placeholder="Elegir medicamento..."
                                    invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                              </Field>
                            )}
                          />
                        </div>

                        {/* Configuración de Fecha y Aplicación Inicial */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {/* Fecha de Inicio (Primera Dosis) */}
                          <Field data-invalid={!!errors.treatments?.[index]?.first_dose_date}>
                            <FieldLabel htmlFor={`treatments.${index}.first_dose_date`}>Fecha Primera Dosis *</FieldLabel>
                            <FieldContent>
                              <Input
                                id={`treatments.${index}.first_dose_date`}
                                type="date"
                                {...register(`treatments.${index}.first_dose_date` as const)}
                              />
                              <FieldError errors={[errors.treatments?.[index]?.first_dose_date]} />
                            </FieldContent>
                          </Field>

                          {/* Toggle de Aplicación de Primera Dosis */}
                          <Controller
                            name={`treatments.${index}.is_first_dose_applied` as const}
                            control={control}
                            render={({ field: subField }) => (
                              <div className="flex items-center justify-between pb-3 h-10 border rounded-md px-3 bg-background border-neutral-200 dark:border-neutral-800">
                                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                  ¿Dosis inicial aplicada?
                                </span>
                                <Switch checked={subField.value} onCheckedChange={subField.onChange} />
                              </div>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-end">
                          {/* Dosis (Cantidad) */}
                          <Field data-invalid={!!errors.treatments?.[index]?.quantity}>
                            <FieldLabel htmlFor={`treatments.${index}.quantity`}>Dosis (Unidades base) *</FieldLabel>
                            <FieldContent>
                              <Input
                                id={`treatments.${index}.quantity`}
                                type="number"
                                step="0.01"
                                placeholder="Ej. 10.5"
                                {...register(`treatments.${index}.quantity` as const)}
                              />
                              <FieldError errors={[errors.treatments?.[index]?.quantity]} />
                            </FieldContent>
                          </Field>

                          {/* Toggle de Recurrencia */}
                          <Controller
                            name={`treatments.${index}.is_recurring` as const}
                            control={control}
                            render={({ field: subField }) => (
                              <div className="flex items-center justify-between pb-3 h-10 border rounded-md px-3 bg-background border-neutral-200 dark:border-neutral-800">
                                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                  ¿Dosis múltiples?
                                </span>
                                <Switch checked={subField.value} onCheckedChange={subField.onChange} />
                              </div>
                            )}
                          />
                        </div>

                        {/* Controles de Recurrencia condicionales */}
                        <Controller
                          name={`treatments.${index}.is_recurring` as const}
                          control={control}
                          render={({ field: subField }) =>
                            subField.value ? (
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Field data-invalid={!!errors.treatments?.[index]?.frequency_hours}>
                                  <FieldLabel htmlFor={`treatments.${index}.frequency_hours`}>Frecuencia (Horas) *</FieldLabel>
                                  <FieldContent>
                                    <Input
                                      id={`treatments.${index}.frequency_hours`}
                                      type="number"
                                      placeholder="Ej: 24"
                                      {...register(`treatments.${index}.frequency_hours` as const)}
                                    />
                                    <FieldError errors={[errors.treatments?.[index]?.frequency_hours]} />
                                  </FieldContent>
                                </Field>

                                <Field data-invalid={!!errors.treatments?.[index]?.total_doses}>
                                  <FieldLabel htmlFor={`treatments.${index}.total_doses`}>Total de Aplicaciones *</FieldLabel>
                                  <FieldContent>
                                    <Input
                                      id={`treatments.${index}.total_doses`}
                                      type="number"
                                      placeholder="Ej: 3"
                                      {...register(`treatments.${index}.total_doses` as const)}
                                    />
                                    <FieldError errors={[errors.treatments?.[index]?.total_doses]} />
                                  </FieldContent>
                                </Field>
                              </div>
                            ) : <></>
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP NAVIGATION */}
          {!isDataLoading && (
            <StepNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onBack={prevStep}
              onNext={nextStep}
              cancelUrl="/dashboard/health/clinic-histories"
              isPending={isPending}
            />
          )}
        </div>
      </form>
    </div>
  );
}
