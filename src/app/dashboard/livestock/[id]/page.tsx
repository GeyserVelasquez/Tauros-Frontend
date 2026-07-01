"use client";

import { use } from "react";
import { LivestockDetail, isFemaleCategory } from "@/features/livestock";
import { ServiceFormModal } from "@/features/services";
import { RevisionFormModal } from "@/features/revisions";
import { AbortFormModal } from "@/features/aborts";
import { Button } from "@/components/ui/button";
import { Calendar, Activity, FileText } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AnimalDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <LivestockDetail
        id={id}
        renderExtraActions={(animal, actions) => {
          if (!isFemaleCategory(animal.animal_category)) return null;
          return (
            <>
              <Button variant="outline" onClick={() => actions.setIsServiceOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Registrar Servicio
              </Button>
              <Button variant="outline" onClick={() => actions.setIsRevisionOpen(true)}>
                <Activity className="mr-2 h-4 w-4" />
                Palpación
              </Button>
              <Button variant="outline" onClick={() => actions.setIsAbortOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Aborto
              </Button>
            </>
          );
        }}
        renderExtraModals={(animal, states) => (
          <>
            <ServiceFormModal
              open={states.isServiceOpen}
              onOpenChange={states.setIsServiceOpen}
              femaleId={animal.id}
            />
            <RevisionFormModal
              open={states.isRevisionOpen}
              onOpenChange={states.setIsRevisionOpen}
              livestockId={animal.id}
            />
            <AbortFormModal
              open={states.isAbortOpen}
              onOpenChange={states.setIsAbortOpen}
              livestockId={animal.id}
            />
          </>
        )}
      />
    </div>
  );
}
