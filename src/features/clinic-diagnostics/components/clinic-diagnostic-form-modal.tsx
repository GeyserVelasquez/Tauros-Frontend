"use client";

import { useFieldArray } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClinicDiagnostic } from "../types";
import { useClinicDiagnosticForm } from "../hooks/useClinicDiagnosticForm";

interface ClinicDiagnosticFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClinicDiagnostic;
}

export function ClinicDiagnosticFormModal({
  open,
  onOpenChange,
  initialData,
}: ClinicDiagnosticFormModalProps) {
  const isMobile = useIsMobile();

  const {
    isEdit,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
  } = useClinicDiagnosticForm({ open, onOpenChange, initialData });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const formFields = (
    <FieldGroup className="space-y-4 py-2 font-montserrat">
      {/* 1. Código del Diagnóstico */}
      <Field data-invalid={!!errors.code}>
        <FieldLabel htmlFor="code">Código *</FieldLabel>
        <FieldContent>
          <Input
            id="code"
            type="text"
            placeholder="Ej. DG-001"
            disabled={isEdit || isPending}
            {...register("code")}
            aria-invalid={!!errors.code}
          />
          <FieldError errors={[errors.code]} />
        </FieldContent>
      </Field>

      {/* 2. Nombre del Diagnóstico */}
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nombre del Diagnóstico *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            type="text"
            placeholder="Ej. Mastitis, Pododermatitis, etc."
            disabled={isPending}
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      {/* 3. Atributos Dinámicos */}
      <div className="space-y-2 border-t pt-4 border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Propiedades/Atributos Adicionales
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => append({ key: "", value: "" })}
            className="h-8 text-xs flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir Atributo
          </Button>
        </div>

        <p className="text-xs text-neutral-500">
          Agrega especificaciones personalizadas para este diagnóstico como Severidad, Síntomas principales o Observaciones.
        </p>

        {fields.length > 0 && (
          <div className="space-y-2 mt-2 max-h-[220px] overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <Field className="flex-1" data-invalid={!!errors.attributes?.[index]?.key}>
                  <FieldContent>
                    <Input
                      type="text"
                      placeholder="Propiedad (ej. Severidad)"
                      disabled={isPending}
                      {...register(`attributes.${index}.key` as const)}
                      aria-label="Nombre del atributo"
                    />
                    <FieldError errors={[errors.attributes?.[index]?.key]} />
                  </FieldContent>
                </Field>

                <Field className="flex-[1.5]" data-invalid={!!errors.attributes?.[index]?.value}>
                  <FieldContent>
                    <Input
                      type="text"
                      placeholder="Valor (ej. Moderada)"
                      disabled={isPending}
                      {...register(`attributes.${index}.value` as const)}
                      aria-label="Valor del atributo"
                    />
                    <FieldError errors={[errors.attributes?.[index]?.value]} />
                  </FieldContent>
                </Field>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => remove(index)}
                  className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 mt-0.5 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FieldGroup>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="font-montserrat">
          <DrawerHeader className="text-left">
            <DrawerTitle>{isEdit ? "Editar Diagnóstico" : "Registrar Diagnóstico"}</DrawerTitle>
            <DrawerDescription>
              Modifique o complete los datos generales del diagnóstico clínico.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh]">
            <form id="mobile-diagnostic-form" onSubmit={handleSubmit(onSubmit)}>
              {formFields}
            </form>
          </div>
          <DrawerFooter className="pt-4">
            <Button
              type="submit"
              form="mobile-diagnostic-form"
              disabled={isPending}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEdit ? "Guardar Cambios" : "Registrar Diagnóstico"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full"
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg font-montserrat">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Diagnóstico" : "Registrar Diagnóstico"}</DialogTitle>
          <DialogDescription>
            Defina el código, nombre y atributos específicos de este diagnóstico clínico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {formFields}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
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
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEdit ? "Guardar Cambios" : "Registrar Diagnóstico"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
