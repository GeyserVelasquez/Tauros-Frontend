"use client";

import {useRouter} from "next/navigation";
import {ChevronLeft, ChevronRight, Save} from "lucide-react";

import {Button} from "@/components/ui/button";
import {FieldGroup} from "@/components/ui/field";
import {StepIndicator} from "@/components/ui/step-indicator";
import {StepHeader} from "@/components/ui/step-header";
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

interface LivestockWizardFormProps {
    initialData?: Livestock;
    onSubmit: (data: LivestockFormData) => void;
    isPending: boolean;
}

export function LivestockWizardForm({
                                        initialData,
                                        onSubmit,
                                        isPending,
                                    }: LivestockWizardFormProps) {
    const router = useRouter();

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
            <StepIndicator currentStep={step} totalSteps={5}/>

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
                    <div className="mt-8 flex justify-between border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={step === 1 ? () => router.push("/dashboard/livestock") : handleBack}
                            disabled={isPending}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4"/>
                            Atrás
                        </Button>

                        {step < 5 ? (
                            <Button type="button" onClick={handleNext}>
                                Siguiente
                                <ChevronRight className="ml-2 h-4 w-4"/>
                            </Button>
                        ) : (
                            <Button key="submit-button" type="submit" disabled={isPending}
                                    className="bg-primary hover:bg-primary/95 text-primary-foreground">
                                <Save className="mr-2 h-4 w-4"/>
                                {isPending ? "Guardando..." : "Guardar Registro"}
                            </Button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
