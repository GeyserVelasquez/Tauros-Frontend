"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExtractionTable, ExtractionFormModal, useCreateExtraction } from "@/features/extractions";

export default function ExtractionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { mutate: createExtraction, isPending } = useCreateExtraction();

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Extracciones Genéticas
            </h1>
            <p className="text-muted-foreground text-sm">
              Historial de colectas, almacenamiento de lotes de semen o embriones e inventario.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="active:scale-95 transition-transform bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Extracción
          </Button>
        </div>

        <div className="mt-4">
          <ExtractionTable />
        </div>
      </div>

      {isCreateOpen && (
        <ExtractionFormModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={(data) => {
            createExtraction(data, {
              onSuccess: () => setIsCreateOpen(false),
            });
          }}
          isPending={isPending}
        />
      )}
    </>
  );
}
