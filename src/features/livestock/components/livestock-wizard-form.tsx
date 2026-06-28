"use client";

import {useState, useMemo} from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { SearchableSelect } from "./searchable-select";
import { livestockFormSchema, LivestockFormData, Livestock } from "../types";
import {
  useBreeds,
  useColors,
  useClassifications,
  useEntryCauses,
  useStates,
  useOwners,
  useTechnicians,
} from "../hooks/useDropdownOptions";
import { useLivestockList } from "../hooks/useLivestock";

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
  const [step, setStep] = useState<number>(1);

  // Carga de catálogos
  const { data: breeds = [], isLoading: isLoadingBreeds } = useBreeds();
  const { data: colors = [], isLoading: isLoadingColors } = useColors();
  const { data: classifications = [], isLoading: isLoadingClassifications } = useClassifications();
  const { data: entryCauses = [], isLoading: isLoadingCauses } = useEntryCauses();
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: owners = [], isLoading: isLoadingOwners } = useOwners();
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useTechnicians();
  
  // Carga de opciones de ganado para genealogía
  const { data: livestockData } = useLivestockList();
  const rawLivestockOptions = livestockData?.data || [];

  // Mapear opciones de ganado a { id, name }
  const livestockOptions = useMemo(() => {
    const list = rawLivestockOptions.map((animal) => ({
      id: animal.id,
      name: `${animal.brand_number} ${animal.name ? `- ${animal.name}` : ""}`,
    }));

    // Asegurarse de inyectar las relaciones iniciales en caso de edición para que no desaparezcan de la lista
    if (initialData) {
      const extraAnimals = [
        initialData.father,
        initialData.mother,
        initialData.adoptive_mother,
        initialData.receiving_mother,
      ].filter(Boolean) as Livestock[];

      extraAnimals.forEach((extra) => {
        if (!list.some((item) => item.id === extra.id)) {
          list.push({
            id: extra.id,
            name: `${extra.brand_number} ${extra.name ? `- ${extra.name}` : ""}`,
          });
        }
      });
    }

    return list;
  }, [rawLivestockOptions, initialData]);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<LivestockFormData>({
    resolver: zodResolver(livestockFormSchema),
    defaultValues: {
      brand_number: initialData?.brand_number || "",
      electronic_code: initialData?.electronic_code || "",
      name: initialData?.name || "",
      birth_date: initialData?.birth_date || "",
      entry_date: initialData?.entry_date || "",
      general_comment: initialData?.general_comment || "",
      tits: initialData?.tits !== undefined ? initialData.tits : 0,
      is_enabled: initialData?.is_enabled !== undefined ? initialData.is_enabled : true,
      is_alive: initialData?.is_alive !== undefined ? initialData.is_alive : true,
      animal_category: initialData?.animal_category || "",
      entry_cause_id: initialData?.entry_cause_id || 0,
      state_id: initialData?.state_id || 0,
      breed_id: initialData?.breed_id || null,
      color_id: initialData?.color_id || null,
      classification_id: initialData?.classification_id || null,
      owner_id: initialData?.owner_id || null,
      technician_id: initialData?.technician_id || null,
      father_id: initialData?.father_id || null,
      mother_id: initialData?.mother_id || null,
      adoptive_mother_id: initialData?.adoptive_mother_id || null,
      receiving_mother_id: initialData?.receiving_mother_id || null,
    },
    mode: "onChange",
  });

  // Campos a validar por cada paso
  const stepFields: Record<number, (keyof LivestockFormData)[]> = {
    1: ["brand_number", "electronic_code", "name", "animal_category"],
    2: ["is_alive", "is_enabled", "entry_cause_id", "state_id", "birth_date", "entry_date"],
    3: ["tits", "breed_id", "color_id", "classification_id"],
    4: ["owner_id", "technician_id", "father_id", "mother_id", "adoptive_mother_id", "receiving_mother_id"],
    5: ["general_comment"],
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[step];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const isFormLoading =
    isLoadingBreeds ||
    isLoadingColors ||
    isLoadingClassifications ||
    isLoadingCauses ||
    isLoadingStates ||
    isLoadingOwners ||
    isLoadingTechnicians;

  const categories = [
    { id: "bull", name: "Toro" },
    { id: "steer", name: "Novillo" },
    { id: "male_yearling", name: "Maute" },
    { id: "bull_calf", name: "Becerro" },
    { id: "cow", name: "Vaca" },
    { id: "heifer", name: "Novilla" },
    { id: "female_yearling", name: "Mauta" },
    { id: "heifer_calf", name: "Becerra" },
  ];

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-card p-6 shadow-sm font-montserrat">
      {/* Indicador de Pasos */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-1 items-center">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                step === s
                  ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                  : step > s
                  ? "bg-muted-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 5 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                  step > s ? "bg-muted-foreground" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {step === 1 && "Paso 1: Identificación Básica"}
          {step === 2 && "Paso 2: Fechas y Estado Operativo"}
          {step === 3 && "Paso 3: Atributos y Morfología"}
          {step === 4 && "Paso 4: Responsables y Genealogía"}
          {step === 5 && "Paso 5: Observaciones"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === 1 && "Información única que distingue al animal en el rebaño."}
          {step === 2 && "Estado vital del animal y sus fechas de registro."}
          {step === 3 && "Detalles físicos y taxonomía básica del ganado."}
          {step === 4 && "Asignación de responsables y árbol genealógico básico."}
          {step === 5 && "Comentarios y observaciones generales del animal."}
        </p>
      </div>

      {isFormLoading ? (
        <div className="py-8 text-center text-muted-foreground">Cargando catálogos...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="min-h-[300px]">
            {/* Paso 1 */}
            {step === 1 && (
              <>
                <Field data-invalid={!!errors.brand_number}>
                  <FieldLabel htmlFor="brand_number">Número de Marca / Arete *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="brand_number"
                      placeholder="Ej: MARCA-102"
                      className="uppercase"
                      {...register("brand_number")}
                      aria-invalid={!!errors.brand_number}
                    />
                    <FieldError errors={[errors.brand_number]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.electronic_code}>
                  <FieldLabel htmlFor="electronic_code">Código Electrónico / Chip</FieldLabel>
                  <FieldContent>
                    <Input
                      id="electronic_code"
                      placeholder="Ej: RFID900123"
                      {...register("electronic_code")}
                      aria-invalid={!!errors.electronic_code}
                    />
                    <FieldError errors={[errors.electronic_code]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Nombre del Animal</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      placeholder="Ej: Clementina"
                      {...register("name")}
                      aria-invalid={!!errors.name}
                    />
                    <FieldError errors={[errors.name]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.animal_category}>
                  <FieldLabel>Categoría *</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="animal_category"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={categories}
                          placeholder="Seleccionar Categoría..."
                        />
                      )}
                    />
                    <FieldError errors={[errors.animal_category]} />
                  </FieldContent>
                </Field>
              </>
            )}

            {/* Paso 2 */}
            {step === 2 && (
              <>
                <div className="flex gap-8">
                  <Field className="flex-1">
                    <FieldLabel htmlFor="is_alive">¿Está Vivo?</FieldLabel>
                    <FieldContent className="flex items-center">
                      <Controller
                        name="is_alive"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="is_alive"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <FieldDescription className="ml-3 mt-0">
                        Indica si el animal se encuentra vivo actualmente.
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field className="flex-1">
                    <FieldLabel htmlFor="is_enabled">Habilitado para Producción</FieldLabel>
                    <FieldContent className="flex items-center">
                      <Controller
                        name="is_enabled"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="is_enabled"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <FieldDescription className="ml-3 mt-0">
                        Define si el animal está activo para ordeño u otras tareas.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </div>

                <Field data-invalid={!!errors.entry_cause_id}>
                  <FieldLabel>Causa de Ingreso *</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="entry_cause_id"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value || null}
                          onChange={field.onChange}
                          options={entryCauses}
                          placeholder="Seleccionar Causa de Ingreso..."
                        />
                      )}
                    />
                    <FieldError errors={[errors.entry_cause_id]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.state_id}>
                  <FieldLabel>Estado Productivo/Salud *</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="state_id"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value || null}
                          onChange={field.onChange}
                          options={states}
                          placeholder="Seleccionar Estado..."
                        />
                      )}
                    />
                    <FieldError errors={[errors.state_id]} />
                  </FieldContent>
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!errors.birth_date}>
                    <FieldLabel htmlFor="birth_date">Fecha de Nacimiento</FieldLabel>
                    <FieldContent>
                      <Input
                        id="birth_date"
                        type="date"
                        {...register("birth_date")}
                        aria-invalid={!!errors.birth_date}
                      />
                      <FieldError errors={[errors.birth_date]} />
                    </FieldContent>
                  </Field>

                  <Field data-invalid={!!errors.entry_date}>
                    <FieldLabel htmlFor="entry_date">Fecha de Ingreso al Rancho</FieldLabel>
                    <FieldContent>
                      <Input
                        id="entry_date"
                        type="date"
                        {...register("entry_date")}
                        aria-invalid={!!errors.entry_date}
                      />
                      <FieldError errors={[errors.entry_date]} />
                    </FieldContent>
                  </Field>
                </div>
              </>
            )}

            {/* Paso 3 */}
            {step === 3 && (
              <>
                <Field data-invalid={!!errors.tits}>
                  <FieldLabel htmlFor="tits">Cantidad de Tetas *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="tits"
                      type="number"
                      min="0"
                      {...register("tits", { valueAsNumber: true })}
                      aria-invalid={!!errors.tits}
                    />
                    <FieldError errors={[errors.tits]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.breed_id}>
                  <FieldLabel>Raza</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="breed_id"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={breeds}
                          placeholder="Seleccionar Raza..."
                        />
                      )}
                    />
                    <FieldError errors={[errors.breed_id]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.color_id}>
                  <FieldLabel>Color</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="color_id"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={colors}
                          placeholder="Seleccionar Color..."
                        />
                      )}
                    />
                    <FieldError errors={[errors.color_id]} />
                  </FieldContent>
                </Field>

                <Field data-invalid={!!errors.classification_id}>
                  <FieldLabel>Clasificación</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="classification_id"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={classifications}
                          placeholder="Seleccionar Clasificación..."
                        />
                      )}
                    />
                    <FieldError errors={[errors.classification_id]} />
                  </FieldContent>
                </Field>
              </>
            )}

            {/* Paso 4 */}
            {step === 4 && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!errors.owner_id}>
                    <FieldLabel>Propietario</FieldLabel>
                    <FieldContent>
                      <Controller
                        name="owner_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={owners}
                            placeholder="Seleccionar Propietario..."
                          />
                        )}
                      />
                      <FieldError errors={[errors.owner_id]} />
                    </FieldContent>
                  </Field>

                  <Field data-invalid={!!errors.technician_id}>
                    <FieldLabel>Médico Veterinario</FieldLabel>
                    <FieldContent>
                      <Controller
                        name="technician_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={technicians}
                            placeholder="Seleccionar Veterinario..."
                          />
                        )}
                      />
                      <FieldError errors={[errors.technician_id]} />
                    </FieldContent>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!errors.father_id}>
                    <FieldLabel>Padre (Toro)</FieldLabel>
                    <FieldContent>
                      <Controller
                        name="father_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={livestockOptions}
                            placeholder="Buscar Padre..."
                          />
                        )}
                      />
                      <FieldError errors={[errors.father_id]} />
                    </FieldContent>
                  </Field>

                  <Field data-invalid={!!errors.mother_id}>
                    <FieldLabel>Madre Biológica (Vaca)</FieldLabel>
                    <FieldContent>
                      <Controller
                        name="mother_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={livestockOptions}
                            placeholder="Buscar Madre..."
                          />
                        )}
                      />
                      <FieldError errors={[errors.mother_id]} />
                    </FieldContent>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!errors.adoptive_mother_id}>
                    <FieldLabel>Madre Adoptiva</FieldLabel>
                    <FieldContent>
                      <Controller
                        name="adoptive_mother_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={livestockOptions}
                            placeholder="Buscar Madre Adoptiva..."
                          />
                        )}
                      />
                      <FieldError errors={[errors.adoptive_mother_id]} />
                    </FieldContent>
                  </Field>

                  <Field data-invalid={!!errors.receiving_mother_id}>
                    <FieldLabel>Receptora de Embrión</FieldLabel>
                    <FieldContent>
                      <Controller
                        name="receiving_mother_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={livestockOptions}
                            placeholder="Buscar Receptora..."
                          />
                        )}
                      />
                      <FieldError errors={[errors.receiving_mother_id]} />
                    </FieldContent>
                  </Field>
                </div>
              </>
            )}

            {/* Paso 5 */}
            {step === 5 && (
              <>
                <Field data-invalid={!!errors.general_comment}>
                  <FieldLabel htmlFor="general_comment">Comentarios Generales</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="general_comment"
                      placeholder="Ingrese detalles sobre el historial del animal, condiciones especiales, etc."
                      className="min-h-[150px]"
                      {...register("general_comment")}
                    />
                    <FieldError errors={[errors.general_comment]} />
                  </FieldContent>
                </Field>
              </>
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
              <ChevronLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>

            {step < 5 ? (
              <Button type="button" onClick={handleNext}>
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button key="submit-button" type="submit" disabled={isPending} className="bg-primary hover:bg-primary/95 text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Guardando..." : "Guardar Registro"}
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
