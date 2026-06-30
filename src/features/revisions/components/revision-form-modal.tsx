"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SearchableSelect } from "@/features/livestock/components/searchable-select";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";

import {
  revisionFormSchema,
  RevisionFormData,
  Revision,
} from "../types";
import {
  useRevisionTypes,
  useTechniciansList,
} from "../hooks/useRevisions";
import { useCreateRevision, useUpdateRevision } from "../hooks/useMutateRevisions";

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
  const isEdit = !!initialData;

  // Catálogos
  const { data: revisionTypes = [], isLoading: isLoadingTypes } = useRevisionTypes();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechniciansList();
  
  // Ganado hembra
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createRevision, isPending: isCreating } = useCreateRevision();
  const { mutate: updateRevision, isPending: isUpdating } = useUpdateRevision();
  const isPending = isCreating || isUpdating;

  // Filtrado de hembras
  const femaleCategories = ["cow", "heifer", "female_yearling", "heifer_calf"];
  const femaleOptions = useMemo(() => {
    const list = livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && femaleCategories.includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));

    if (initialData?.livestock && !list.some((item) => item.id === initialData.livestock_id)) {
      list.push({
        id: initialData.livestock_id,
        name: `${initialData.livestock.brand_number} ${initialData.livestock.name ? `- ${initialData.livestock.name}` : ""}`,
      });
    }

    return list;
  }, [livestockList, initialData]);

  const technicianOptions = useMemo(() => {
    return technicians.map((t) => ({ id: t.id, name: t.name }));
  }, [technicians]);

  // Valores por defecto
  const defaultValues = useMemo<Partial<RevisionFormData>>(() => {
    if (initialData) {
      return {
        livestock_id: initialData.livestock_id,
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        revision_result: initialData.revision_result,
        revision_type_id: initialData.revision_type_id,
        technician_id: initialData.technician_id,
      };
    }
    return {
      livestock_id: livestockId || undefined,
      made_at: new Date().toISOString().split("T")[0],
      revision_result: "empty",
      revision_type_id: undefined,
      technician_id: null,
    };
  }, [initialData, livestockId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RevisionFormData>({
    resolver: zodResolver(revisionFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reiniciar el formulario al abrir/cerrar o cambiar datos iniciales
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onSubmit = (data: RevisionFormData) => {
    if (isEdit && initialData) {
      updateRevision(
        { id: initialData.id, formData: data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createRevision(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isFormLoading = isLoadingTypes || isLoadingTechnicians || isLoadingLivestock;

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
                  options={[
                    { id: "pregnant", name: "Preñada" },
                    { id: "empty", name: "Vacía" },
                    { id: "waiting", name: "En Espera" },
                  ]}
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
            <DrawerTitle>{isEdit ? "Editar Palpación" : "Registrar Palpación"}</DrawerTitle>
            <DrawerDescription>
              Ingrese los detalles del diagnóstico reproductivo (palpación).
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
              {isEdit ? "Guardar Cambios" : "Confirmar Palpación"}
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
          <DialogTitle>{isEdit ? "Editar Palpación" : "Registrar Palpación"}</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del diagnóstico reproductivo (palpación).
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
                {isEdit ? "Guardar Cambios" : "Confirmar Palpación"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
