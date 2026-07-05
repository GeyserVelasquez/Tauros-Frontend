import { TreatmentCalendar } from "@/features/treatment-applications/components/treatment-calendar";

export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-900 p-4 border rounded-lg border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-montserrat">Calendario Veterinario</h1>
        <p className="text-sm text-muted-foreground font-montserrat">
          Planifique y supervise la aplicación de tratamientos y vacunas para el ganado de forma visual.
        </p>
      </div>
      <TreatmentCalendar />
    </div>
  );
}
