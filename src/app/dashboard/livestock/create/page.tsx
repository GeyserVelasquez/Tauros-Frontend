"use client";

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Registrar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Formulario */}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
