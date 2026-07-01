"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BirthTable, BirthWizardForm, useCreateBirth } from "@/features/births";

export default function BirthsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { mutate: createBirth, isPending } = useCreateBirth();

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Registro de Partos
            </h1>
            <p className="text-muted-foreground text-sm">
              Control, registro e historial de nacimientos en el rancho.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="active:scale-95 transition-transform bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Parto
          </Button>
        </div>

        <div className="mt-4">
          <BirthTable />
        </div>
      </div>

      {isCreateOpen && (
        <BirthWizardForm
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={(data) => {
            createBirth(data, {
              onSuccess: () => setIsCreateOpen(false),
            });
          }}
          isPending={isPending}
        />
      )}
    </>
  );
}
