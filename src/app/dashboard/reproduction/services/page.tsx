"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ServiceTable, ServiceFormModal } from "@/features/services";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Servicios Reproductivos</h1>
            <p className="text-muted-foreground text-sm">
              Control, registro e historial de reproducción del hato (Montas, IA y Transferencias).
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Servicio
          </Button>
        </div>

        <div className="mt-4">
          <ServiceTable />
        </div>
      </div>

      {/* Modal de Registro Global */}
      <ServiceFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
