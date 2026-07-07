"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MilkingTable, MilkingFormModal } from "@/features/milkings";

export default function MilkingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registro de Ordeños</h1>
            <p className="text-muted-foreground text-sm">
              Monitoreo y control de la producción de leche diaria por animal.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Ordeño
          </Button>
        </div>

        <div className="mt-4">
          <MilkingTable />
        </div>
      </div>

      {/* Modal de Registro */}
      <MilkingFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
