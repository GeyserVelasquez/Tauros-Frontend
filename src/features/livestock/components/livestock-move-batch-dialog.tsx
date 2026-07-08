"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Livestock } from "../types";
import { useMoveLivestockToBatch } from "../hooks/useMutateLivestock";
import { useBatchList } from "@/features/batches";

interface LivestockMoveBatchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Livestock | null;
}

interface MoveFormData {
  batch_id: number;
  made_at: string;
}

const moveSchema = z.object({
  batch_id: z.number({ message: "El lote de destino es obligatorio" }).min(1, "El lote de destino es obligatorio"),
  made_at: z.string().min(1, "La fecha de la asignación es obligatoria"),
});

export function LivestockMoveBatchDialog({ isOpen, onOpenChange, animal }: LivestockMoveBatchDialogProps) {
  const { data: batchResponse } = useBatchList({ per_page: 100 });
  const batches = batchResponse?.data || [];

  const { mutate: moveAnimal, isPending: isMoving } = useMoveLivestockToBatch();

  const todayStr = React.useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const { handleSubmit, control, reset, register, formState: { errors } } = useForm<MoveFormData>({
    resolver: zodResolver(moveSchema),
    defaultValues: {
      batch_id: undefined,
      made_at: todayStr,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        batch_id: animal?.batch_id || undefined,
        made_at: todayStr,
      });
    }
  }, [isOpen, animal, todayStr, reset]);

  const onSubmit = (data: MoveFormData) => {
    if (!animal) return;

    moveAnimal(
      {
        id: animal.id,
        batch_id: data.batch_id,
        made_at: data.made_at,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] font-montserrat">
        <DialogHeader>
          <DialogTitle>Asignar Animal a Lote</DialogTitle>
          <DialogDescription>
            Selecciona el lote administrativo para el animal <strong>{animal?.brand_number}</strong>. Esto registrará el movimiento en el historial y también actualizará su potrero actual si el lote tiene un potrero asignado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="batch_id">Lote Destino</Label>
            <Controller
              name="batch_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un lote" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={String(batch.id)}>
                        {batch.name} ({batch.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.batch_id && (
              <p className="text-sm text-destructive">{errors.batch_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="made_at">Fecha de Asignación</Label>
            <Input
              id="made_at"
              type="date"
              {...register("made_at")}
            />
            {errors.made_at && (
              <p className="text-sm text-destructive">{errors.made_at.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isMoving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isMoving} className="active:scale-95 transition-transform">
              {isMoving ? "Asignando..." : "Confirmar Asignación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
