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
import { OUTCOME_TYPE_OPTIONS } from "../types";
import { useOutcomeForm } from "../hooks/useOutcomeForm";

interface OutcomeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockId?: number | null;
}

export function OutcomeFormModal({
  open,
  onOpenChange,
  livestockId,
}: OutcomeFormModalProps) {
  const isMobile = useIsMobile();

  const {
    isFormLoading,
    isPending,
    handleSubmit,
    control,
    register,
    errors,
    outcomeType,
    livestockOptions,
    deathCauseOptions,
    onSubmit,
  } = useOutcomeForm({ open, onOpenChange, livestockId });

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
                disabled={!!livestockId}
              />
            )}
          />
          <FieldError errors={[errors.livestock_id]} />
        </FieldContent>
      </Field>

      {/* 2. Tipo de Salida y Fecha (en paralelo) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tipo de Salida */}
        <Field data-invalid={!!errors.outcome_type} className="flex-1">
          <FieldLabel>Tipo de Salida *</FieldLabel>
          <FieldContent>
            <Controller
              name="outcome_type"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={OUTCOME_TYPE_OPTIONS}
                  placeholder="Seleccionar tipo..."
                />
              )}
            />
            <FieldError errors={[errors.outcome_type]} />
          </FieldContent>
        </Field>

        {/* Fecha de la Salida */}
        <Field data-invalid={!!errors.made_at} className="flex-1">
          <FieldLabel htmlFor="made_at">Fecha de Salida *</FieldLabel>
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

      {/* 3. Causa de Muerte (Condicional, solo si es de tipo "death") */}
      {outcomeType === "death" && (
        <Field data-invalid={!!errors.death_cause_id}>
          <FieldLabel>Causa de Muerte *</FieldLabel>
          <FieldContent>
            <Controller
              name="death_cause_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val ? Number(val) : null)}
                  options={deathCauseOptions}
                  placeholder="Seleccionar causa de muerte..."
                />
              )}
            />
            <FieldError errors={[errors.death_cause_id]} />
          </FieldContent>
        </Field>
      )}
    </FieldGroup>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="font-montserrat">
          <DrawerHeader className="text-left">
            <DrawerTitle>Registrar Salida de Animal</DrawerTitle>
            <DrawerDescription>
              Ingrese los detalles de la salida. El animal será marcado como Inactivo.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto max-h-[60vh]">
            {isFormLoading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Cargando catálogos...
              </div>
            ) : (
              <form id="mobile-outcome-form" onSubmit={handleSubmit(onSubmit)}>
                {formFields}
              </form>
            )}
          </div>
          <DrawerFooter className="pt-4">
            <Button
              type="submit"
              form="mobile-outcome-form"
              disabled={isPending || isFormLoading}
              className="w-full active:scale-95 transition-transform"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Salida
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
          <DialogTitle>Registrar Salida de Animal</DialogTitle>
          <DialogDescription>
            Ingrese los detalles de la salida. El animal será marcado como Inactivo.
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
                Confirmar Salida
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
