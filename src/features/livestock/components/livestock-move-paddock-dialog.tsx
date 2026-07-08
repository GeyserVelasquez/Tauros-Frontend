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
import { useMoveLivestockToPaddock } from "../hooks/useMutateLivestock";
import { usePaddockList } from "@/features/paddocks";

interface LivestockMovePaddockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Livestock | null;
}

interface MoveFormData {
  paddock_id: number;
  made_at: string;
}

const moveSchema = z.object({
  paddock_id: z.number({ message: "El potrero de destino es obligatorio" }).min(1, "El potrero de destino es obligatorio"),
  made_at: z.string().min(1, "La fecha del traslado es obligatoria"),
});

export function LivestockMovePaddockDialog({ isOpen, onOpenChange, animal }: LivestockMovePaddockDialogProps) {
  const { data: paddockResponse } = usePaddockList({ per_page: 100 });
  const paddocks = paddockResponse?.data || [];

  const { mutate: moveAnimal, isPending: isMoving } = useMoveLivestockToPaddock();

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
      paddock_id: undefined,
      made_at: todayStr,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        paddock_id: animal?.paddock_id || undefined,
        made_at: todayStr,
      });
    }
  }, [isOpen, animal, todayStr, reset]);

  const onSubmit = (data: MoveFormData) => {
    if (!animal) return;

    moveAnimal(
      {
        id: animal.id,
        paddock_id: data.paddock_id,
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
          <DialogTitle>Trasladar Animal a Potrero</DialogTitle>
          <DialogDescription>
            Selecciona el potrero físico donde se ubicará el animal <strong>{animal?.brand_number}</strong>. Esto registrará el movimiento en el historial físico sin cambiar su lote administrativo actual.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="paddock_id">Potrero Destino</Label>
            <Controller
              name="paddock_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un potrero" />
                  </SelectTrigger>
                  <SelectContent>
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

          <div className="space-y-2">
            <Label htmlFor="made_at">Fecha del Traslado</Label>
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
              {isMoving ? "Trasladando..." : "Confirmar Traslado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
