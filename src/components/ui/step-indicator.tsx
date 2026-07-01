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
  const stepsList = React.useMemo(() => {
    return Array.from({ length: totalSteps }, (_, i) => i + 1);
  }, [totalSteps]);

  return (
    <div className={`flex items-center ${className}`}>
      {stepsList.map((step) => (
        <div
          key={step}
          className={`flex items-center ${step < totalSteps ? "flex-1" : "flex-none"}`}
        >
          <div
            className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
              currentStep === step
                ? "bg-primary text-primary-foreground scale-125 text-sm shadow-sm"
                : currentStep > step
                ? "bg-muted-foreground text-background"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                currentStep > step ? "bg-muted-foreground" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
