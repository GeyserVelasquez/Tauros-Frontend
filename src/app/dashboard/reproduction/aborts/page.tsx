"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AbortTable, AbortFormModal } from "@/features/aborts";

export default function AbortsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registro de Abortos</h1>
            <p className="text-muted-foreground text-sm">
              Control, pérdidas de gestación y seguimiento veterinario de abortos en el hato.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Aborto
          </Button>
        </div>

        <div className="mt-4">
          <AbortTable />
        </div>
      </div>

      {/* Modal de Registro */}
      <AbortFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
