"use client";

import { useRouter } from "next/navigation";
import { ClinicHistoryWizardForm } from "@/features/clinic-histories/components/clinic-history-wizard-form";
import { useCreateClinicHistory } from "@/features/clinic-histories/hooks/useClinicHistories";

export default function CreateClinicHistoryPage() {
  const router = useRouter();
  const { mutate: createHistory, isPending } = useCreateClinicHistory();

  const handleFormSubmit = (data: any) => {
    createHistory(data, {
      onSuccess: () => {
        router.push("/dashboard/health/clinic-histories");
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Registrar Consulta Médica</h1>
        <p className="text-muted-foreground">
          Complete el formulario paso a paso para agendar diagnósticos y tratamientos correctivos/preventivos.
        </p>
      </div>

      <div className="mt-4">
        <ClinicHistoryWizardForm onSubmit={handleFormSubmit} isPending={isPending} />
      </div>
    </div>
  );
}
