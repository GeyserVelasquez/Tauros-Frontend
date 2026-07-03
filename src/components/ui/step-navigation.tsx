"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  cancelUrl: string;
  isPending: boolean;
  className?: string;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  cancelUrl,
  isPending,
  className = "mt-8 flex justify-between border-t pt-4",
}: StepNavigationProps) {
  const router = useRouter();

  return (
    <div className={`font-montserrat ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={currentStep === 1 ? () => router.push(cancelUrl) : onBack}
        disabled={isPending}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Atrás
      </Button>

      {currentStep < totalSteps ? (
        <Button type="button" onClick={onNext} disabled={isPending}>
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          key="submit-button"
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/95 text-primary-foreground"
        >
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Guardando..." : "Guardar Registro"}
        </Button>
      )}
    </div>
  );
}
