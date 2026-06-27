"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Cabecera */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/livestock">Ganado</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/dashboard/livestock/${id}`}>Ficha</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Editar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Formulario */}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
