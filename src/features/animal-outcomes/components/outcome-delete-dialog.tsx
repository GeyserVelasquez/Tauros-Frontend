"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OutcomeDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function OutcomeDeleteDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
}: OutcomeDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-montserrat">
        <DialogHeader>
          <DialogTitle>¿Está seguro de revertir esta salida?</DialogTitle>
          <DialogDescription>
            Esta acción reactivará al animal en la finca, eliminando el registro histórico de su salida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? "Revirtiendo..." : "Confirmar Reversión"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
