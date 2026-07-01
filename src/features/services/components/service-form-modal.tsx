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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Service } from "../types";
import { useServiceForm } from "../hooks/useServiceForm";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  femaleId?: number | null;
  initialData?: Service;
}

export function ServiceFormModal({
  open,
  onOpenChange,
  femaleId,
  initialData,
}: ServiceFormModalProps) {
  const isMobile = useIsMobile();

  const {
    isEdit,
    isFormLoading,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    parentableType,
    femaleOptions,
    bullOptions,
    semenOptions,
    embrionOptions,
    technicianOptions,
    serviceTypes,
    onSubmit,
  } = useServiceForm({ open, onOpenChange, femaleId, initialData });

  // Renderizar campos del formulario
  const formFields = (
    <FieldGroup className="space-y-4 py-2 font-montserrat">
      {/* 1. Selector de Hembra */}
      <Field data-invalid={!!errors.female_id}>
        <FieldLabel>Hembra (Madre) *</FieldLabel>
        <FieldContent>
          <Controller
            name="female_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={femaleOptions}
                placeholder="Seleccionar madre..."
                disabled={!!femaleId || isEdit}
              />
            )}
          />
          <FieldError errors={[errors.female_id]} />
        </FieldContent>
      </Field>

      {/* 2. Tipo de Servicio y Tipo de Parental (en paralelo) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tipo de Servicio (Catálogo dinámico del backend) */}
        <Field data-invalid={!!errors.service_type_id} className="flex-1">
          <FieldLabel>Tipo de Servicio *</FieldLabel>
          <FieldContent>
            <Controller
              name="service_type_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={serviceTypes.map((t) => ({ id: t.id, name: t.name }))}
                  placeholder="Seleccionar tipo"
                />
              )}
            />
            <FieldError errors={[errors.service_type_id]} />
          </FieldContent>
        </Field>

        {/* Tipo de Parental (Desacoplado de service_type) */}
        <Field data-invalid={!!errors.parentable_type} className="flex-1">
          <FieldLabel>Origen del Servicio *</FieldLabel>
          <FieldContent>
            <Controller
              name="parentable_type"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { id: "livestock", name: "Monta Natural" },
                    { id: "semen_batch", name: "Inseminación Artificial" },
                    { id: "embrion_batch", name: "Transplante de Embrion" },
                  ]}
                  placeholder="Seleccionar origen"
                  disabled={isEdit}
                />
              )}
            />
            <FieldError errors={[errors.parentable_type]} />
          </FieldContent>
        </Field>
      </div>

      {/* 4. Selector del Parental Específico (Cargado según selección del paso 3) */}
      {parentableType && (
        <Field data-invalid={!!errors.parentable_id}>
          <FieldLabel>
            {parentableType === "livestock" && "Padrote / Toro *"}
            {parentableType === "semen_batch" && "Lote de Semen *"}
            {parentableType === "embrion_batch" && "Lote de Embriones *"}
          </FieldLabel>
          <FieldContent>
            <Controller
              name="parentable_id"
              control={control}
              render={({ field }) => {
                let options: { id: number | string; name: string }[] = [];
                let placeholder = "Seleccionar...";

                if (parentableType === "livestock") {
                  options = bullOptions;
                  placeholder = "Seleccionar padrote...";
                } else if (parentableType === "semen_batch") {
                  options = semenOptions;
                  placeholder = "Seleccionar lote de semen...";
                } else if (parentableType === "embrion_batch") {
                  options = embrionOptions;
                  placeholder = "Seleccionar lote de embriones...";
                }

                return (
                  <SearchableSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={options}
                    placeholder={placeholder}
                    disabled={isEdit}
                  />
                );
              }}
            />
            <FieldError errors={[errors.parentable_id]} />
          </FieldContent>
        </Field>
      )}

      {/* 5. Fecha del Servicio */}
      <Field data-invalid={!!errors.made_at}>
        <FieldLabel htmlFor="made_at">Fecha del Servicio *</FieldLabel>
        <FieldContent>
          <Input
            id="made_at"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            {...register("made_at")}
            aria-invalid={!!errors.made_at}
          />
          <FieldError errors={[errors.made_at]} />
        </FieldContent>
      </Field>

      {/* 6. Técnico / Veterinario */}
      <Field data-invalid={!!errors.technician_id}>
        <FieldLabel>Veterinario / Técnico</FieldLabel>
        <FieldContent>
          <Controller
            name="technician_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                onChange={(val) => field.onChange(val || null)}
                options={technicianOptions}
                placeholder="Seleccionar veterinario..."
              />
            )}
          />
          <FieldError errors={[errors.technician_id]} />
        </FieldContent>
      </Field>
    </FieldGroup>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="font-montserrat">
          <DrawerHeader className="text-left">
            <DrawerTitle>{isEdit ? "Editar Servicio" : "Registrar Servicio"}</DrawerTitle>
            <DrawerDescription>
              Ingrese los detalles del servicio reproductivo del animal.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh]">
            {isFormLoading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Cargando catálogos...
              </div>
            ) : (
              <form id="mobile-service-form" onSubmit={handleSubmit(onSubmit)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4">
            <Button
              type="submit"
              form="mobile-service-form"
              disabled={isPending || isFormLoading}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guardar Cambios" : "Confirmar Servicio"}
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
      <DialogContent className="sm:max-w-[600px] font-montserrat backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Servicio" : "Registrar Servicio"}</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del servicio reproductivo del animal.
          </DialogDescription>
        </DialogHeader>
        
        {isFormLoading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Cargando catálogos...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formFields}
            
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="active:scale-95 transition-transform"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Guardar Cambios" : "Confirmar Servicio"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
