"use client";

import { useRouter } from "next/navigation";
import { LivestockWizardForm, useCreateLivestock } from "@/features/livestock";

export default function CreateLivestockPage() {
  const router = useRouter();
  const { mutate: createAnimal, isPending } = useCreateLivestock();

  const handleFormSubmit = (data: any) => {
    createAnimal(data, {
      onSuccess: () => {
        router.push("/dashboard/livestock");
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Registrar Nuevo Animal</h1>
        <p className="text-muted-foreground">
          Complete el formulario para incorporar un nuevo animal al inventario del rancho.
        </p>
      </div>

      <div className="mt-4">
        <LivestockWizardForm onSubmit={handleFormSubmit} isPending={isPending} />
      </div>
    </div>
  );
}
