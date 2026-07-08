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
import { Growth } from "../types";
import { useGrowthForm } from "../hooks/useGrowthForm";

interface GrowthFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
  initialData?: Growth;
}

export function GrowthFormModal({
  open,
  onOpenChange,
  livestockId,
  initialData,
}: GrowthFormModalProps) {
  const isMobile = useIsMobile();

  const {
    isEdit,
    isFormLoading,
    isPending,
    register,
    handleSubmit,
    control,
    errors,
    livestockOptions,
    technicianOptions,
    growthTypes,
    onSubmit,
  } = useGrowthForm({ open, onOpenChange, livestockId, initialData });

  const formFields = (
    <FieldGroup className="space-y-4 py-2 font-montserrat">
      {/* 1. Selección de Animal */}
      <Field data-invalid={!!errors.livestock_id}>
        <FieldLabel>Animal *</FieldLabel>
        <FieldContent>
          <Controller
            name="livestock_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={livestockOptions}
                placeholder="Seleccionar animal..."
                disabled={!!livestockId || isEdit}
              />
            )}
          />
          <FieldError errors={[errors.livestock_id]} />
        </FieldContent>
      </Field>

      {/* 2. Tipo de Registro y Fecha (en paralelo) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tipo de Crecimiento */}
        <Field data-invalid={!!errors.growth_type_id} className="flex-1">
          <FieldLabel>Tipo de Registro *</FieldLabel>
          <FieldContent>
            <Controller
              name="growth_type_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={growthTypes.map((t) => ({ id: t.id, name: t.name }))}
                  placeholder="Seleccionar tipo..."
                />
              )}
            />
            <FieldError errors={[errors.growth_type_id]} />
          </FieldContent>
        </Field>

        {/* Fecha */}
        <Field data-invalid={!!errors.made_at} className="flex-1">
          <FieldLabel htmlFor="made_at">Fecha de Registro *</FieldLabel>
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
      </div>

      {/* 3. Peso Principal */}
      <Field data-invalid={!!errors.weight}>
        <FieldLabel htmlFor="weight">Peso (Kg) *</FieldLabel>
        <FieldContent>
          <Input
            id="weight"
            type="number"
            step="0.01"
            {...register("weight")}
            placeholder="Ingrese el peso del animal"
          />
          <FieldError errors={[errors.weight]} />
        </FieldContent>
      </Field>

      {/* 4. Medidas Opcionales (Altura, Largo, Ancho Torácico) en grid de 3 columnas */}
      <div className="grid grid-cols-3 gap-4">
        {/* Altura */}
        <Field data-invalid={!!errors.height}>
          <FieldLabel htmlFor="height">Altura (Cm)</FieldLabel>
          <FieldContent>
            <Input
              id="height"
              type="number"
              step="0.01"
              {...register("height")}
              placeholder="Opcional"
            />
            <FieldError errors={[errors.height]} />
          </FieldContent>
        </Field>

        {/* Largo */}
        <Field data-invalid={!!errors.length}>
          <FieldLabel htmlFor="length">Largo (Cm)</FieldLabel>
          <FieldContent>
            <Input
              id="length"
              type="number"
              step="0.01"
              {...register("length")}
              placeholder="Opcional"
            />
            <FieldError errors={[errors.length]} />
          </FieldContent>
        </Field>

        {/* Ancho Torácico */}
        <Field data-invalid={!!errors.thoracic_width}>
          <FieldLabel htmlFor="thoracic_width">Ancho Tor. (Cm)</FieldLabel>
          <FieldContent>
            <Input
              id="thoracic_width"
              type="number"
              step="0.01"
              {...register("thoracic_width")}
              placeholder="Opcional"
            />
            <FieldError errors={[errors.thoracic_width]} />
          </FieldContent>
        </Field>
      </div>

      {/* 5. Técnico / Operario */}
      <Field data-invalid={!!errors.technician_id}>
        <FieldLabel>Registrador / Técnico</FieldLabel>
        <FieldContent>
          <Controller
            name="technician_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                onChange={(val) => field.onChange(val || null)}
                options={technicianOptions}
                placeholder="Seleccionar técnico..."
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
            <DrawerTitle>{isEdit ? "Editar Crecimiento" : "Registrar Crecimiento"}</DrawerTitle>
            <DrawerDescription>
              Ingrese las medidas físicas y de peso del animal.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh]">
            {isFormLoading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Cargando catálogos...
              </div>
            ) : (
              <form id="mobile-growth-form" onSubmit={handleSubmit(onSubmit)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4">
            <Button
              type="submit"
              form="mobile-growth-form"
              disabled={isPending || isFormLoading}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guardar Cambios" : "Confirmar Registro"}
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
      <DialogContent className="sm:max-w-[500px] font-montserrat backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Crecimiento" : "Registrar Crecimiento"}</DialogTitle>
          <DialogDescription>
            Ingrese las medidas físicas y de peso del animal.
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
                {isEdit ? "Guardar Cambios" : "Confirmar Registro"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
