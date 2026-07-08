"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paddock, paddockFormSchema, PaddockFormData } from "../types";
import { useCreatePaddock, useUpdatePaddock } from "../hooks/useMutatePaddocks";

interface PaddockFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  paddock?: Paddock | null;
}

export function PaddockFormDialog({ isOpen, onOpenChange, paddock }: PaddockFormDialogProps) {
  const isEdit = !!paddock;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaddockFormData>({
    resolver: zodResolver(paddockFormSchema),
    defaultValues: {
      name: "",
      code: "",
      area: null,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (paddock) {
        reset({
          name: paddock.name,
          code: paddock.code || "",
          area: paddock.area ? Number(paddock.area) : null,
        });
      } else {
        reset({
          name: "",
          code: "",
          area: null,
        });
      }
    }
  }, [isOpen, paddock, reset]);

  const { mutate: createPaddock, isPending: isCreating } = useCreatePaddock();
  const { mutate: updatePaddock, isPending: isUpdating } = useUpdatePaddock();
  const isSaving = isCreating || isUpdating;

  const onSubmit = (data: PaddockFormData) => {
    const areaVal = data.area === "" || data.area === undefined || data.area === null ? null : Number(data.area);
    const payload = {
      ...data,
      area: areaVal,
    };

    if (isEdit && paddock) {
      updatePaddock(
        { id: paddock.id, formData: payload as any },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createPaddock(payload as any, {
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
          <DialogTitle>{isEdit ? "Editar Potrero" : "Registrar Potrero"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Potrero</Label>
            <Input
              id="name"
              placeholder="Ej. Potrero Alto"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código Identificador (Opcional)</Label>
            <Input
              id="code"
              placeholder="Ej. POT-01"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área (Hectáreas - Opcional)</Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              placeholder="Ej. 15.5"
              {...register("area")}
            />
            {errors.area && (
              <p className="text-sm text-destructive">{errors.area.message}</p>
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
