"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Save, Loader2, ChevronDown } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useBirthWizardForm } from "../hooks/useBirthWizardForm";
import { Birth, BirthWizardData, BirthFlatFormData, NEWBORN_CATEGORY_OPTIONS } from "../types";
import { STATE_OPTIONS } from "@/features/livestock";

interface BirthWizardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Birth;
  onSubmit: (data: BirthWizardData) => void;
  isPending: boolean;
}

export function BirthWizardForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: BirthWizardFormProps) {
  const isEdit = !!initialData;
  const isMobile = useIsMobile();

  const {
    methods,
    isFormLoading,
    birthTypes,
    newbornTypes,
    entryCauses,
    colors,
    breeds,
    technicians,
    femaleOptions,
    fatherOptions,
  } = useBirthWizardForm({ initialData });

  const {
    control,
    handleSubmit,
  } = methods;

  // Local state to track if details collapsible is expanded
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  const handleFormSubmit = (flatData: BirthFlatFormData) => {
    const apiPayload: BirthWizardData = {
      mother_id: flatData.mother_id,
      birth_date: flatData.birth_date,
      postbirth_revision_date: flatData.postbirth_revision_date,
      birth_type_id: flatData.birth_type_id,
      technician_id: flatData.technician_id,
      newborns: [{
        brand_number: flatData.brand_number,
        animal_category: flatData.animal_category,
        newborn_type_id: flatData.newborn_type_id,
        state: flatData.state,
        entry_cause_id: flatData.entry_cause_id,
        color_id: flatData.color_id,
        breed_id: flatData.breed_id,
        father_id: flatData.father_id,
        electronic_code: flatData.electronic_code,
        name: flatData.name,
        general_comment: flatData.general_comment,
      }],
    };
    onSubmit(apiPayload);
  };

  const formFields = (
    <div className="space-y-6">
      {/* Seccion 1: Datos del Parto */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          1. Datos del Parto
        </h3>
        <FieldGroup className="space-y-4">
          {/* Vaca Madre */}
          <Controller
            name="mother_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel>Hembra (Madre) *</FieldLabel>
                <FieldContent>
                  <SearchableSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                    options={femaleOptions}
                    placeholder="Seleccionar madre..."
                    disabled={isEdit}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Fecha de Parto */}
            <Controller
              name="birth_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel htmlFor={field.name}>Fecha de Parto *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      aria-invalid={fieldState.invalid ? "true" : undefined}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            {/* Fecha de Revisión Postparto */}
            <Controller
              name="postbirth_revision_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel htmlFor={field.name}>Revisión Postparto *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      aria-invalid={fieldState.invalid ? "true" : undefined}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Tipo de Parto */}
            <Controller
              name="birth_type_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel>Tipo de Parto *</FieldLabel>
                  <FieldContent>
                    <SearchableSelect
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        field.onBlur();
                      }}
                      options={birthTypes}
                      placeholder="Seleccionar tipo..."
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
                      options={technicians.map((t: { id: number; name: string }) => ({ id: t.id, name: t.name }))}
                      placeholder="Seleccionar veterinario..."
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </div>

      {/* Seccion 2: Datos de la Cría */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          2. Datos de la Cría
        </h3>
        <FieldGroup className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Arete / Marca */}
            <Controller
              name="brand_number"
              control={control}
              render={({ field: inputField, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel htmlFor={inputField.name}>Número de Marca / Arete *</FieldLabel>
                  <FieldContent>
                    <Input
                      {...inputField}
                      id={inputField.name}
                      placeholder="Ej: CALF-101"
                      className="uppercase"
                      aria-invalid={fieldState.invalid ? "true" : undefined}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            {/* Categoría */}
            <Controller
              name="animal_category"
              control={control}
              render={({ field: selectField, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel>Categoría / Sexo *</FieldLabel>
                  <FieldContent>
                    <SearchableSelect
                      value={selectField.value}
                      onChange={(val) => {
                        selectField.onChange(val);
                        selectField.onBlur();
                      }}
                      options={NEWBORN_CATEGORY_OPTIONS}
                      placeholder="Seleccionar categoría..."
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Tipo Cría */}
            <Controller
              name="newborn_type_id"
              control={control}
              render={({ field: selectField, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel>Tipo de Cría *</FieldLabel>
                  <FieldContent>
                    <SearchableSelect
                      value={selectField.value}
                      onChange={(val) => {
                        selectField.onChange(val);
                        selectField.onBlur();
                      }}
                      options={newbornTypes}
                      placeholder="Seleccionar tipo..."
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            {/* Estado Inicial */}
            <Controller
              name="state"
              control={control}
              render={({ field: selectField, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel>Estado Inicial *</FieldLabel>
                  <FieldContent>
                    <SearchableSelect
                      value={selectField.value}
                      onChange={(val) => {
                        selectField.onChange(val);
                        selectField.onBlur();
                      }}
                      options={STATE_OPTIONS}
                      placeholder="Seleccionar estado..."
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            {/* Causa de Entrada */}
            <Controller
              name="entry_cause_id"
              control={control}
              render={({ field: selectField, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel>Causa de Entrada *</FieldLabel>
                  <FieldContent>
                    <SearchableSelect
                      value={selectField.value}
                      onChange={(val) => {
                        selectField.onChange(val);
                        selectField.onBlur();
                      }}
                      options={entryCauses}
                      placeholder="Seleccionar causa..."
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          {/* Panel Colapsable de Detalles Físicos y Observaciones Opcionales */}
          <Collapsible open={isOpenDetails} onOpenChange={setIsOpenDetails} className="w-full mt-2">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Detalles Adicionales (Opcional)</span>
                <ChevronDown className={`size-4 transition-transform duration-200 ${isOpenDetails ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Controller
                  name="color_id"
                  control={control}
                  render={({ field: colField }) => (
                    <Field>
                      <FieldLabel>Color</FieldLabel>
                      <FieldContent>
                        <SearchableSelect
                          value={colField.value || ""}
                          onChange={(val) => colField.onChange(val || null)}
                          options={colors}
                          placeholder="Seleccionar color..."
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  name="breed_id"
                  control={control}
                  render={({ field: brField }) => (
                    <Field>
                      <FieldLabel>Raza</FieldLabel>
                      <FieldContent>
                        <SearchableSelect
                          value={brField.value || ""}
                          onChange={(val) => brField.onChange(val || null)}
                          options={breeds}
                          placeholder="Seleccionar raza..."
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  name="father_id"
                  control={control}
                  render={({ field: faField }) => (
                    <Field>
                      <FieldLabel>Padre (Toro)</FieldLabel>
                      <FieldContent>
                        <SearchableSelect
                          value={faField.value || ""}
                          onChange={(val) => faField.onChange(val || null)}
                          options={fatherOptions}
                          placeholder="Seleccionar padre..."
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  name="electronic_code"
                  control={control}
                  render={({ field: codeField }) => (
                    <Field>
                      <FieldLabel htmlFor={codeField.name}>Microchip / Código Electrónico</FieldLabel>
                      <FieldContent>
                        <Input
                          {...codeField}
                          id={codeField.name}
                          placeholder="Ej: 982000001..."
                          value={codeField.value || ""}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field: nameField }) => (
                    <Field>
                      <FieldLabel htmlFor={nameField.name}>Nombre de la Cría</FieldLabel>
                      <FieldContent>
                        <Input
                          {...nameField}
                          id={nameField.name}
                          placeholder="Ej: Lucerito"
                          value={nameField.value || ""}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="general_comment"
                control={control}
                render={({ field: commentField }) => (
                  <Field>
                    <FieldLabel htmlFor={commentField.name}>Observaciones</FieldLabel>
                    <FieldContent>
                      <Textarea
                        {...commentField}
                        id={commentField.name}
                        placeholder="Comentarios u observaciones especiales de la cría..."
                        className="resize-none h-20"
                        value={commentField.value || ""}
                      />
                    </FieldContent>
                  </Field>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
        </FieldGroup>
      </div>
    </div>
  );

  const loaderView = (
    <div className="flex h-40 items-center justify-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      Cargando catálogos...
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="font-montserrat">
          <DrawerHeader className="text-left">
            <DrawerTitle>{isEdit ? "Editar Registro de Parto" : "Registrar Parto"}</DrawerTitle>
            <DrawerDescription>
              Complete los datos principales del parto y del recién nacido.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh] pb-4">
            {isFormLoading ? loaderView : (
              <form id="mobile-birth-form" onSubmit={handleSubmit(handleFormSubmit as any)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4 border-t">
            <Button
              type="submit"
              form="mobile-birth-form"
              disabled={isPending || isFormLoading}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guardar Cambios" : "Guardar Registro"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-6 font-montserrat backdrop-blur-sm">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            {isEdit ? "Editar Registro de Parto" : "Registrar Parto"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Complete los datos principales del parto y del recién nacido.
          </DialogDescription>
        </DialogHeader>

        {isFormLoading ? loaderView : (
          <form onSubmit={handleSubmit(handleFormSubmit as any)}>
            <div className="max-h-[60vh] overflow-y-auto pr-2 pb-2">
              {formFields}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="active:scale-95 transition-transform"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform font-semibold"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Guardar Cambios" : "Guardar Registro"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}