"use client";

import * as React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  className = "mb-8",
}: StepIndicatorProps) {
  const steps = React.useMemo(() => {
    return Array.from({ length: totalSteps }, (_, i) => i + 1);
  }, [totalSteps]);

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((s) => (
        <div key={s} className="flex flex-1 items-center">
          <div
            className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
              currentStep === s
                ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                : currentStep > s
                ? "bg-muted-foreground text-background"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </div>
          {s < totalSteps && (
            <div
              className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                currentStep > s ? "bg-muted-foreground" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
