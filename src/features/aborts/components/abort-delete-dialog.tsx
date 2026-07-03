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

interface AbortDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function AbortDeleteDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
}: AbortDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-montserrat">
        <DialogHeader>
          <DialogTitle>¿Está seguro de eliminar este registro de aborto?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se removerá la información asociada a este aborto.
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
            {isDeleting ? "Eliminando..." : "Eliminar Registro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
