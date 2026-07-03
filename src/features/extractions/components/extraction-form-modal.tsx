"use client";

import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useExtractionForm } from "../hooks/useExtractionForm";
import { Extraction, ExtractionFormData, BATCH_TYPE_OPTIONS } from "../types";

interface ExtractionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Extraction;
  onSubmit: (data: ExtractionFormData) => void;
  isPending: boolean;
}

export function ExtractionFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: ExtractionFormModalProps) {
  const isMobile = useIsMobile();
  const {
    isEdit,
    isFormLoading,
    handleSubmit,
    control,
    errors,
    donorOptions,
    maleOptions,
    technicianOptions,
    extractionTypes,
    geneticableType,
    onSubmit: handleFormSubmit,
  } = useExtractionForm({ open, onOpenChange, initialData });

  const formFields = (
    <FieldGroup className="space-y-5">
      {/* 1. Datos de la Extracción */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          1. Datos de la Extracción
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Fecha de Extracción */}
          <Controller
            name="made_at"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel htmlFor={field.name}>Fecha de Extracción *</FieldLabel>
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

          {/* Tipo de Extracción */}
          <Controller
            name="extraction_type_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel>Tipo de Extracción *</FieldLabel>
                <FieldContent>
                  <SearchableSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                    options={extractionTypes}
                    placeholder="Seleccionar tipo..."
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </div>

        <div className="mt-4">
          {/* Técnico / Veterinario */}
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
                    placeholder="Seleccionar veterinario..."
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </div>
      </div>

      {/* 2. Datos del Lote e Inventario */}
      <div className="border-t pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          2. Información del Lote e Inventario
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Tipo de Lote (Semen / Embrion) */}
          <Controller
            name="geneticable_type"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel>Qué se extrae *</FieldLabel>
                <FieldContent>
                  <SearchableSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                    options={BATCH_TYPE_OPTIONS}
                    placeholder="Seleccionar tipo de lote..."
                    disabled={isEdit}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          {/* Código del Lote */}
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel htmlFor={field.name}>Código de Lote *</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Ej: LOTE-123"
                    className="uppercase"
                    disabled={isEdit}
                    aria-invalid={fieldState.invalid ? "true" : undefined}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          {/* Donante (bull/steer para semen, cow para embrión) */}
          <Controller
            name="female_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel>
                  {geneticableType === "semen_batch" ? "Donante (Toro / Novillo) *" : "Donante Hembra (Vaca / Novilla) *"}
                </FieldLabel>
                <FieldContent>
                  <SearchableSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                    options={donorOptions}
                    placeholder="Seleccionar donante..."
                    disabled={isEdit}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          {/* Cantidad en Unidades */}
          <Controller
            name="quantity"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                <FieldLabel htmlFor={field.name}>Cantidad (Dosis/Unidades) *</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min="1"
                    placeholder="Ej: 10"
                    aria-invalid={fieldState.invalid ? "true" : undefined}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </div>

        {/* Toro Padre (sire) - Solo visible si es embrión */}
        {geneticableType === "embrion_batch" && (
          <div className="mt-4">
            <Controller
              name="male_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? "true" : undefined}>
                  <FieldLabel>Toro Padre (Sire - Opcional)</FieldLabel>
                  <FieldContent>
                    <SearchableSelect
                      value={field.value || ""}
                      onChange={(val) => {
                        field.onChange(val || null);
                        field.onBlur();
                      }}
                      options={maleOptions}
                      placeholder="Seleccionar toro padre..."
                      disabled={isEdit}
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>
        )}
      </div>
    </FieldGroup>
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
            <DrawerTitle>{isEdit ? "Editar Registro de Extracción" : "Registrar Extracción"}</DrawerTitle>
            <DrawerDescription>
              Registre el material genético obtenido y guárdelo en el Kardex.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh] pb-4">
            {isFormLoading ? loaderView : (
              <form id="mobile-extraction-form" onSubmit={handleSubmit(handleFormSubmit as any)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4 border-t">
            <Button
              type="submit"
              form="mobile-extraction-form"
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
      <DialogContent className="sm:max-w-2xl p-6 font-montserrat backdrop-blur-sm">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            {isEdit ? "Editar Registro de Extracción" : "Registrar Extracción"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Registre el material genético obtenido y guárdelo en el Kardex.
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
