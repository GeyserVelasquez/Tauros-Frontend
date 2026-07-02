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
import { Revision, REVISION_RESULT_OPTIONS } from "../types";
import { useRevisionForm } from "../hooks/useRevisionForm";

interface RevisionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
  initialData?: Revision;
}

export function RevisionFormModal({
  open,
  onOpenChange,
  livestockId,
  initialData,
}: RevisionFormModalProps) {
  const isMobile = useIsMobile();

  const {
    isEdit,
    isFormLoading,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    femaleOptions,
    technicianOptions,
    revisionTypes,
    onSubmit,
  } = useRevisionForm({ open, onOpenChange, livestockId, initialData });

  const formFields = (
    <FieldGroup className="space-y-4 py-2 font-montserrat">
      {/* 1. Selección de Animal */}
      <Field data-invalid={!!errors.livestock_id}>
        <FieldLabel>Hembra (Madre) *</FieldLabel>
        <FieldContent>
          <Controller
            name="livestock_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={femaleOptions}
                placeholder="Seleccionar animal..."
                disabled={!!livestockId || isEdit}
              />
            )}
          />
          <FieldError errors={[errors.livestock_id]} />
        </FieldContent>
      </Field>

      {/* 2. Tipo de Revisión y Resultado (en paralelo) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tipo de Revisión */}
        <Field data-invalid={!!errors.revision_type_id} className="flex-1">
          <FieldLabel>Tipo de Revisión *</FieldLabel>
          <FieldContent>
            <Controller
              name="revision_type_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={revisionTypes.map((t) => ({ id: t.id, name: t.name }))}
                  placeholder="Seleccionar tipo..."
                />
              )}
            />
            <FieldError errors={[errors.revision_type_id]} />
          </FieldContent>
        </Field>

        {/* Resultado de la Revisión */}
        <Field data-invalid={!!errors.revision_result} className="flex-1">
          <FieldLabel>Resultado *</FieldLabel>
          <FieldContent>
            <Controller
              name="revision_result"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={REVISION_RESULT_OPTIONS}
                  placeholder="Seleccionar resultado..."
                />
              )}
            />
            <FieldError errors={[errors.revision_result]} />
          </FieldContent>
        </Field>
      </div>

      {/* 3. Fecha de Revisión */}
      <Field data-invalid={!!errors.made_at}>
        <FieldLabel htmlFor="made_at">Fecha de Revisión *</FieldLabel>
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

      {/* 4. Técnico / Veterinario */}
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
            <DrawerTitle>{isEdit ? "Editar Revisión" : "Registrar Revisión"}</DrawerTitle>
            <DrawerDescription>
              Ingrese los detalles de la Revisión.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh]">
            {isFormLoading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Cargando catálogos...
              </div>
            ) : (
              <form id="mobile-revision-form" onSubmit={handleSubmit(onSubmit)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4">
            <Button
              type="submit"
              form="mobile-revision-form"
              disabled={isPending || isFormLoading}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guardar Cambios" : "Confirmar Revisión"}
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
      <DialogContent className="sm:max-w-[480px] font-montserrat backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Revisión" : "Registrar Revisión"}</DialogTitle>
          <DialogDescription>
            Ingrese los detalles de la revisión.
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
                {isEdit ? "Guardar Cambios" : "Confirmar Revisión"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
