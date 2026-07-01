"use client";

import { BirthWizardForm, useCreateBirth } from "@/features/births";

export default function CreateBirthPage() {
  const { mutate: createBirth, isPending } = useCreateBirth();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Registrar Parto</h1>
        <p className="text-muted-foreground text-sm">
          Complete el formulario paso a paso para registrar el parto y las crías nacidas.
        </p>
      </div>

      <div className="mt-4">
        <BirthWizardForm onSubmit={createBirth} isPending={isPending} />
      </div>
    </div>
  );
}
