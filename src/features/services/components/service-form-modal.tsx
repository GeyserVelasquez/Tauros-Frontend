"use client";

import { useEffect, useMemo, useRef } from "react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useLivestockList } from "@/features/livestock/hooks/useLivestock";

import {
  serviceFormSchema,
  ServiceFormData,
  Service,
} from "../types";
import {
  useServiceTypes,
  useSemenBatches,
  useEmbrionBatches,
  useTechniciansList,
} from "../hooks/useServices";
import { useCreateService, useUpdateService } from "../hooks/useMutateServices";

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
  const isEdit = !!initialData;

  // React Query para catálogos
  const { data: serviceTypes = [], isLoading: isLoadingTypes } = useServiceTypes();
  const { data: semenBatches = [], isLoading: isLoadingSemen } = useSemenBatches();
  const { data: embrionBatches = [], isLoading: isLoadingEmbrion } = useEmbrionBatches();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechniciansList();
  
  // Obtenemos ganado para hembras y padrotes
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({ per_page: 1000 });
  const livestockList = livestockResponse?.data || [];

  // Mutaciones
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
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

    // Asegurar que si hay una hembra inicial se agregue a las opciones
    if (initialData?.female && !list.some((item) => item.id === initialData.female_id)) {
      list.push({
        id: initialData.female_id,
        name: `${initialData.female.brand_number} ${initialData.female.name ? `- ${initialData.female.name}` : ""}`,
      });
    }

    return list;
  }, [livestockList, initialData]);

  // Filtrado de machos (padrotes)
  const maleCategories = ["bull", "steer", "male_yearling", "bull_calf"];
  const bullOptions = useMemo(() => {
    return livestockList
      .filter((animal) => animal.is_alive && animal.is_enabled && maleCategories.includes(animal.animal_category))
      .map((animal) => ({
        id: animal.id,
        name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
      }));
  }, [livestockList]);

  // Mapeos para lotes
  const semenOptions = useMemo(() => {
    return semenBatches.map((b) => ({ id: b.id, name: `${b.code} - ${b.name}` }));
  }, [semenBatches]);

  const embrionOptions = useMemo(() => {
    return embrionBatches.map((b) => ({ id: b.id, name: `${b.code} - ${b.name}` }));
  }, [embrionBatches]);

  const technicianOptions = useMemo(() => {
    return technicians.map((t) => ({ id: t.id, name: t.name }));
  }, [technicians]);

  // Valores por defecto
  const defaultValues = useMemo<Partial<ServiceFormData>>(() => {
    if (initialData) {
      return {
        female_id: initialData.female_id,
        service_type_id: initialData.service_type_id,
        made_at: initialData.made_at ? initialData.made_at.split("T")[0] : "",
        technician_id: initialData.technician_id,
        parentable_type: initialData.parentable_type,
        parentable_id: initialData.parentable_id,
      };
    }
    return {
      female_id: femaleId || undefined,
      service_type_id: undefined,
      made_at: new Date().toISOString().split("T")[0],
      technician_id: null,
      parentable_type: undefined,
      parentable_id: undefined,
    };
  }, [initialData, femaleId]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const parentableType = watch("parentable_type");
  const isFirstRender = useRef(true);

  // Reiniciar el formulario y la bandera del primer renderizado al abrir
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      isFirstRender.current = true;
    }
  }, [open, reset, defaultValues]);

  // Limpiar parentable_id únicamente si cambia el parentable_type por interacción del usuario
  useEffect(() => {
    if (parentableType === undefined) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setValue("parentable_id", undefined as any);
  }, [parentableType, setValue]);

  const onSubmit = (data: ServiceFormData) => {
    if (isEdit && initialData) {
      updateService(
        { id: initialData.id, formData: data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createService(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isFormLoading =
    isLoadingTypes ||
    isLoadingSemen ||
    isLoadingEmbrion ||
    isLoadingTechnicians ||
    isLoadingLivestock;

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
