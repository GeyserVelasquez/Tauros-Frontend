"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Batch, batchFormSchema, BatchFormData } from "../types";
import { useCreateBatch, useUpdateBatch } from "../hooks/useMutateBatches";
import { usePaddockList } from "@/features/paddocks";

interface BatchFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  batch?: Batch | null;
}

export function BatchFormDialog({ isOpen, onOpenChange, batch }: BatchFormDialogProps) {
  const isEdit = !!batch;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BatchFormData>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      code: "",
      name: "",
      paddock_id: null,
    },
  });

  const { data: paddockResponse } = usePaddockList({ per_page: 100 });
  const paddocks = paddockResponse?.data || [];

  React.useEffect(() => {
    if (isOpen) {
      if (batch) {
        reset({
          code: batch.code,
          name: batch.name,
          paddock_id: batch.paddock_id,
        });
      } else {
        reset({
          code: "",
          name: "",
          paddock_id: null,
        });
      }
    }
  }, [isOpen, batch, reset]);

  const { mutate: createBatch, isPending: isCreating } = useCreateBatch();
  const { mutate: updateBatch, isPending: isUpdating } = useUpdateBatch();
  const isSaving = isCreating || isUpdating;

  const onSubmit = (data: BatchFormData) => {
    if (isEdit && batch) {
      updateBatch(
        { id: batch.id, formData: data },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createBatch(data, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] font-montserrat">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Lote" : "Registrar Lote"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código del Lote</Label>
            <Input
              id="code"
              placeholder="Ej. LOT-01"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Lote</Label>
            <Input
              id="name"
              placeholder="Ej. Vacas Lecheras"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paddock_id">Potrero Asignado (Opcional)</Label>
            <Controller
              name="paddock_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(val) => {
                    field.onChange(val === "none" ? null : Number(val));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un potrero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin potrero</SelectItem>
                    {paddocks.map((paddock) => (
                      <SelectItem key={paddock.id} value={String(paddock.id)}>
                        {paddock.name} {paddock.code ? `(${paddock.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paddock_id && (
              <p className="text-sm text-destructive">{errors.paddock_id.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="active:scale-95 transition-transform">
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
