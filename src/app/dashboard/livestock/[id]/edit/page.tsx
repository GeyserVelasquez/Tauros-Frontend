"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LivestockWizardForm,
  useLivestockById,
  useUpdateLivestock,
} from "@/features/livestock";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditLivestockPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  // Obtener datos iniciales del animal
  const { data: animal, isLoading, error } = useLivestockById(id);
  const { mutate: updateAnimal, isPending } = useUpdateLivestock();

  const handleFormSubmit = (data: any) => {
    updateAnimal(
      { id, formData: data },
      {
        onSuccess: () => {
          router.push(`/dashboard/livestock/${id}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Editar Ficha de Animal</h1>
        <p className="text-muted-foreground">
          Modifique los datos necesarios. Se validarán los cambios antes de guardarse en el inventario.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : error || !animal ? (
          <div className="p-8 text-center text-red-500">
            Hubo un problema al cargar el registro para editar.
          </div>
        ) : (
          <LivestockWizardForm
            initialData={animal}
            onSubmit={handleFormSubmit}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
}
