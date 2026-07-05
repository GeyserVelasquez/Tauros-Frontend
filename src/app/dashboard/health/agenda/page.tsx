import { TreatmentCalendar } from "@/features/treatment-applications/components/treatment-calendar";

export default function AgendaPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendario Veterinario</h1>
        <p className="text-muted-foreground text-sm">
          Planifique y supervise la aplicación de tratamientos y vacunas para el ganado de forma visual.
        </p>
      </div>
      <div className="mt-4">
        <TreatmentCalendar />
      </div>
    </div>
  );
}
