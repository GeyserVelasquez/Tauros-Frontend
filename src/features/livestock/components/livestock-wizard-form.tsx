"use client";

import {FieldGroup} from "@/components/ui/field";
import {StepIndicator} from "@/components/ui/step-indicator";
import {StepHeader} from "@/components/ui/step-header";
import {StepNavigation} from "@/components/ui/step-navigation";
import {Livestock, LivestockFormData} from "../types";
import {useLivestockWizardForm} from "../hooks/useLivestockWizardForm";
import {StepBasicInfo} from "./wizard/step-basic-info";
import {StepStatus} from "./wizard/step-status";
import {StepAttributes} from "./wizard/step-attributes";
import {StepGenealogy} from "./wizard/step-genealogy";
import {StepComments} from "./wizard/step-comments";

const LIVESTOCK_WIZARD_STEPS: Record<number, { title: string; description: string }> = {
    1: {
        title: "Paso 1: Identificación Básica",
        description: "Información única que distingue al animal en el rebaño.",
    },
    2: {
        title: "Paso 2: Fechas y Estado Operativo",
        description: "Estado vital del animal y sus fechas de registro.",
    },
    3: {
        title: "Paso 3: Atributos y Morfología",
        description: "Detalles físicos y taxonomía básica del ganado.",
    },
    4: {
        title: "Paso 4: Responsables y Genealogía",
        description: "Asignación de responsables y árbol genealógico básico.",
    },
    5: {
        title: "Paso 5: Observaciones",
        description: "Comentarios y observaciones generales del animal.",
    },
};

const TOTAL_STEPS = Object.keys(LIVESTOCK_WIZARD_STEPS).length;

interface LivestockWizardFormProps {
    initialData?: Livestock;
    onSubmit: (data: LivestockFormData) => void;
    isPending: boolean;
}

export function LivestockWizardForm({
        initialData,
        onSubmit,
        isPending,
        }: LivestockWizardFormProps)
    {
    const {
        step,
        handleNext,
        handleBack,
        isFormLoading,
        register,
        handleSubmit,
        control,
        errors,
        breeds,
        colors,
        classifications,
        entryCauses,
        states,
        owners,
        technicians,
        livestockOptions,
    } = useLivestockWizardForm({initialData, onSubmit});

    return (
        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-6 shadow-sm font-montserrat">
            {/* Indicador de Pasos */}
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS}/>

            <StepHeader currentStep={step} stepsConfig={LIVESTOCK_WIZARD_STEPS}/>

            {isFormLoading ? (
                <div className="py-8 text-center text-muted-foreground">Cargando catálogos...</div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="min-h-[300px]">
                        {step === 1 && (
                            <StepBasicInfo
                                register={register}
                                control={control}
                                errors={errors}
                            />
                        )}

                        {step === 2 && (
                            <StepStatus
                                register={register}
                                control={control}
                                errors={errors}
                                entryCauses={entryCauses}
                                states={states}
                            />
                        )}

                        {step === 3 && (
                            <StepAttributes
                                register={register}
                                control={control}
                                errors={errors}
                                breeds={breeds}
                                colors={colors}
                                classifications={classifications}
                            />
                        )}

                        {step === 4 && (
                            <StepGenealogy
                                control={control}
                                errors={errors}
                                owners={owners}
                                technicians={technicians}
                                livestockOptions={livestockOptions}
                            />
                        )}

                        {step === 5 && (
                            <StepComments
                                register={register}
                                errors={errors}
                            />
                        )}
                    </FieldGroup>

                    {/* Botones de navegación */}
                    <StepNavigation
                        currentStep={step}
                        totalSteps={TOTAL_STEPS}
                        onBack={handleBack}
                        onNext={handleNext}
                        cancelUrl="/dashboard/livestock"
                        isPending={isPending}
                    />
                </form>
            )}
        </div>
    );
}
