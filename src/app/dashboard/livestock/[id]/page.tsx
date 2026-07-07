"use client";

import { use } from "react";
import { LivestockDetail, isFemaleCategory } from "@/features/livestock";
import { ServiceFormModal } from "@/features/services";
import { RevisionFormModal } from "@/features/revisions";
import { AbortFormModal } from "@/features/aborts";
import { GrowthFormModal } from "@/features/growths";
import { MilkingFormModal } from "@/features/milkings";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Calendar, Activity, FileText, Scale, Milk } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LivestockDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 font-montserrat">
      <LivestockDetail
        id={id}
        renderExtraActions={(animal, actions) => {
          const isFemale = isFemaleCategory(animal.animal_category);
          return (
            <>
              {isFemale && (
                <>
                  <DropdownMenuItem onClick={() => actions.setIsServiceOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Registrar Servicio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => actions.setIsRevisionOpen(true)}>
                    <Activity className="mr-2 h-4 w-4" />
                    Palpación
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => actions.setIsAbortOpen(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Aborto
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => actions.setIsMilkingOpen(true)}>
                    <Milk className="mr-2 h-4 w-4" />
                    Registrar Ordeño
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => actions.setIsGrowthOpen(true)}>
                <Scale className="mr-2 h-4 w-4" />
                Registrar Crecimiento
              </DropdownMenuItem>
            </>
          );
        }}
        renderExtraModals={(animal, states) => {
          const isFemale = isFemaleCategory(animal.animal_category);
          return (
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
              <GrowthFormModal
                open={states.isGrowthOpen}
                onOpenChange={states.setIsGrowthOpen}
                livestockId={animal.id}
              />
              {isFemale && (
                <MilkingFormModal
                  open={states.isMilkingOpen}
                  onOpenChange={states.setIsMilkingOpen}
                  livestockId={animal.id}
                />
              )}
            </>
          );
        }}
      />
    </div>
  );
}


