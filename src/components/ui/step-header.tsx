"use client";

import * as React from "react";

interface StepHeaderProps {
  currentStep: number;
  stepsConfig: Record<
    number,
    {
      title: string;
      description: string;
    }
  >;
  className?: string;
}

export function StepHeader({
  currentStep,
  stepsConfig,
  className = "mb-6",
}: StepHeaderProps) {
  const currentStepConfig = stepsConfig[currentStep];

  if (!currentStepConfig) return null;

  return (
    <div className={`font-montserrat ${className}`}>
      <h2 className="text-xl font-semibold">
        {currentStepConfig.title}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {currentStepConfig.description}
      </p>
    </div>
  );
}
