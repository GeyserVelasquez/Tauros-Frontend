"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchTable } from "@/features/batches/components/batch-table";

export default function BatchesPage() {
  const [triggerCreate, setTriggerCreate] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Lotes</h1>
          <p className="text-muted-foreground">
            Administra agrupaciones de animales, sus ubicaciones físicas y traslados masivos.
          </p>
        </div>
        <Button
          onClick={() => setTriggerCreate(true)}
          className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Lote
        </Button>
      </div>

      <div className="mt-4">
        <BatchTable
          onCreateTrigger={triggerCreate}
          onCreateTriggerChange={setTriggerCreate}
        />
      </div>
    </div>
  );
}
