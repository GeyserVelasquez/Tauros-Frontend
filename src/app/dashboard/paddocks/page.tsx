"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaddockTable } from "@/features/paddocks/components/paddock-table";

export default function PaddocksPage() {
  const [triggerCreate, setTriggerCreate] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Potreros</h1>
          <p className="text-muted-foreground">
            Administra los potreros, áreas físicas y distribución de tus animales.
          </p>
        </div>
        <Button
          onClick={() => setTriggerCreate(true)}
          className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Potrero
        </Button>
      </div>

      <div className="mt-4">
        <PaddockTable
          onCreateTrigger={triggerCreate}
          onCreateTriggerChange={setTriggerCreate}
        />
      </div>
    </div>
  );
}
