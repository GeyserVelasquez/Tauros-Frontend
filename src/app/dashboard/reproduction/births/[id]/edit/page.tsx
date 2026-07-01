"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BirthWizardForm, useBirthById, useUpdateBirth } from "@/features/births";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditBirthPage({ params }: PageProps) {
  const { id } = use(params);

  // Fetch birth record details including relationships
  const {
    data: birth,
    isLoading,
    error,
  } = useBirthById(id, {
    include: "mother,technician,birthType,newborns.livestock",
  });

  const { mutate: updateBirth, isPending } = useUpdateBirth(Number(id));

  const handleFormSubmit = (data: any) => {
    updateBirth(data);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Editar Registro de Parto</h1>
        <p className="text-muted-foreground text-sm">
          Modifique los datos necesarios. Se validarán las crías y la cabecera antes de guardar.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : error || !birth ? (
          <div className="p-8 text-center text-red-500 font-semibold">
            Hubo un problema al cargar el registro del parto para editar.
          </div>
        ) : (
          <BirthWizardForm
            initialData={birth}
            onSubmit={handleFormSubmit}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
}
