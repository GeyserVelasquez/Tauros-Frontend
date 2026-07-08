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
import { Milking } from "../types";
import { useMilkingForm } from "../hooks/useMilkingForm";

interface MilkingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
  initialData?: Milking;
}

export function MilkingFormModal({
  open,
  onOpenChange,
  livestockId,
  initialData,
}: MilkingFormModalProps) {
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
    milkingTypes,
    onSubmit,
  } = useMilkingForm({ open, onOpenChange, livestockId, initialData });

  const formFields = (
    <FieldGroup className="space-y-4 py-2 font-montserrat">
      {/* 1. Selección de Animal */}
      <Field data-invalid={!!errors.livestock_id}>
        <FieldLabel>Vaca / Novilla hembra *</FieldLabel>
        <FieldContent>
          <Controller
            name="livestock_id"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={femaleOptions}
                placeholder="Seleccionar hembra..."
                disabled={!!livestockId || isEdit}
              />
            )}
          />
          <FieldError errors={[errors.livestock_id]} />
        </FieldContent>
      </Field>

      {/* 2. Tipo de Ordeño y Fecha (en paralelo) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tipo de Ordeño */}
        <Field data-invalid={!!errors.milking_type_id} className="flex-1">
          <FieldLabel>Tipo de Ordeño *</FieldLabel>
          <FieldContent>
            <Controller
              name="milking_type_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={milkingTypes.map((t) => ({ id: t.id, name: t.name }))}
                  placeholder="Seleccionar tipo..."
                />
              )}
            />
            <FieldError errors={[errors.milking_type_id]} />
          </FieldContent>
        </Field>

        {/* Fecha */}
        <Field data-invalid={!!errors.made_at} className="flex-1">
          <FieldLabel htmlFor="made_at">Fecha de Ordeño *</FieldLabel>
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

      {/* 3. Tres Pesajes de Ordeño en una sola fila */}
      <div className="grid grid-cols-3 gap-4">
        {/* Ordeño 1 */}
        <Field data-invalid={!!errors.first_weight}>
          <FieldLabel htmlFor="first_weight">Ordeño 1 (Kg)</FieldLabel>
          <FieldContent>
            <Input
              id="first_weight"
              type="number"
              step="0.01"
              {...register("first_weight")}
              placeholder="0.00"
            />
            <FieldError errors={[errors.first_weight]} />
          </FieldContent>
        </Field>

        {/* Ordeño 2 */}
        <Field data-invalid={!!errors.second_weight}>
          <FieldLabel htmlFor="second_weight">Ordeño 2 (Kg)</FieldLabel>
          <FieldContent>
            <Input
              id="second_weight"
              type="number"
              step="0.01"
              {...register("second_weight")}
              placeholder="0.00"
            />
            <FieldError errors={[errors.second_weight]} />
          </FieldContent>
        </Field>

        {/* Ordeño 3 */}
        <Field data-invalid={!!errors.third_weight}>
          <FieldLabel htmlFor="third_weight">Ordeño 3 (Kg)</FieldLabel>
          <FieldContent>
            <Input
              id="third_weight"
              type="number"
              step="0.01"
              {...register("third_weight")}
              placeholder="0.00"
            />
            <FieldError errors={[errors.third_weight]} />
          </FieldContent>
        </Field>
      </div>

      {/* 4. Técnico / Operario */}
      <Field data-invalid={!!errors.technician_id}>
        <FieldLabel>Operador / Técnico</FieldLabel>
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
            <DrawerTitle>{isEdit ? "Editar Ordeño" : "Registrar Ordeño"}</DrawerTitle>
            <DrawerDescription>
              Ingrese los pesos de la producción lechera diaria.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh]">
            {isFormLoading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Cargando catálogos...
              </div>
            ) : (
              <form id="mobile-milking-form" onSubmit={handleSubmit(onSubmit)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4">
            <Button
              type="submit"
              form="mobile-milking-form"
              disabled={isPending || isFormLoading}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guardar Cambios" : "Confirmar Ordeño"}
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
          <DialogTitle>{isEdit ? "Editar Ordeño" : "Registrar Ordeño"}</DialogTitle>
          <DialogDescription>
            Ingrese los pesos de la producción lechera diaria.
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
                {isEdit ? "Guardar Cambios" : "Confirmar Ordeño"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
