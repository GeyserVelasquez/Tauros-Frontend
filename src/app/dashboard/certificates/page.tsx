"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateTable } from "@/features/certificates/components/certificate-table";
import { CertificateFormDialog } from "@/features/certificates/components/certificate-form-dialog";
import { Certificate } from "@/features/certificates/types";

export default function CertificatesPage() {
  const [triggerCreate, setTriggerCreate] = React.useState(false);
  const [selectedToEdit, setSelectedToEdit] = React.useState<Certificate | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Certificados de Vacas</h1>
          <p className="text-muted-foreground">
            Registra y gestiona los certificados sanitarios, genéticos y de control de tus animales por lote o de forma individual.
          </p>
        </div>
        <Button
          onClick={() => setTriggerCreate(true)}
          className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Certificado
        </Button>
      </div>

      <div className="mt-4">
        <CertificateTable
          onCreateTrigger={triggerCreate}
          onCreateTriggerChange={setTriggerCreate}
          onEditTrigger={(cert) => setSelectedToEdit(cert)}
        />
      </div>

      <CertificateFormDialog
        isOpen={triggerCreate || !!selectedToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setTriggerCreate(false);
            setSelectedToEdit(null);
          }
        }}
        certificate={selectedToEdit}
      />
    </div>
  );
}
