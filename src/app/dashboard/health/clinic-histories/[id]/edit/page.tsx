"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ClinicHistoryWizardForm } from "@/features/clinic-histories/components/clinic-history-wizard-form";
import { useClinicHistory, useUpdateClinicHistory } from "@/features/clinic-histories/hooks/useClinicHistories";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditClinicHistoryPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  // Fetch initial clinic history with relations
  const { data: history, isLoading, error } = useClinicHistory(id, {
    include: "livestock,technician,clinicDiagnostics,clinicalTreatments,treatmentApplications",
  });
  
  const updateMutation = useUpdateClinicHistory();

  const handleFormSubmit = (data: any) => {
    updateMutation.mutate(
      { id: parseInt(id), formData: data },
      {
        onSuccess: () => {
          router.push("/dashboard/health/clinic-histories");
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Editar Consulta Médica</h1>
        <p className="text-muted-foreground">
          Modifique los diagnósticos y planificaciones de tratamientos del animal.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : error || !history ? (
          <div className="p-8 text-center text-red-500">
            Hubo un problema al cargar la consulta médica para editar.
          </div>
        ) : (
          <ClinicHistoryWizardForm
            initialData={history}
            onSubmit={handleFormSubmit}
            isPending={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
