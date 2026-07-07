"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useBatchList } from "@/features/batches";
import { useLivestockList } from "@/features/livestock";
import { useCreateCertificate, useUpdateCertificate } from "../hooks/useMutateCertificates";
import { certificateFormSchema, CertificateFormData, Certificate } from "../types";
import { Upload, X, Search, Check } from "lucide-react";

interface CertificateFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
}

export function CertificateFormDialog({ isOpen, onOpenChange, certificate }: CertificateFormDialogProps) {
  const [assignByBatch, setAssignByBatch] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [livestockSearch, setLivestockSearch] = React.useState("");
  const [selectedLivestockIds, setSelectedLivestockIds] = React.useState<number[]>([]);
  const [animalNamesMap, setAnimalNamesMap] = React.useState<Record<number, string>>({});

  const { data: batchResponse } = useBatchList({ per_page: 100 });
  const batches = batchResponse?.data || [];

  // Buscador de animales por marca
  const { data: livestockResponse, isLoading: isLoadingLivestock } = useLivestockList({
    per_page: 50,
    search: livestockSearch,
  });
  const livestock = livestockResponse?.data || [];

  const { mutate: createCertificate, isPending: isCreating } = useCreateCertificate();
  const { mutate: updateCertificate, isPending: isUpdating } = useUpdateCertificate();
  const isSaving = isCreating || isUpdating;

  const { handleSubmit, control, reset, register, setValue, formState: { errors } } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      certificate_number: "",
      issue_date: "",
      expiry_date: "",
      assign_by: "batch",
      batch_id: null,
      livestock_ids: [],
      file: null,
    },
  });

  // Guardar nombres/marcas en el mapa al cargarse
  React.useEffect(() => {
    if (livestock.length > 0) {
      const nextMap = { ...animalNamesMap };
      livestock.forEach((animal) => {
        nextMap[animal.id] = animal.brand_number;
      });
      setAnimalNamesMap(nextMap);
    }
  }, [livestock]);

  React.useEffect(() => {
    if (isOpen) {
      if (certificate) {
        const isBatch = !!(certificate.batches && certificate.batches.length > 0);
        const currentBatchId = certificate.batches?.[0]?.id || null;
        const currentLivestockIds = certificate.livestock?.map((l) => l.id) || [];

        reset({
          certificate_number: certificate.certificate_number,
          issue_date: certificate.issue_date,
          expiry_date: certificate.expiry_date || "",
          assign_by: isBatch ? "batch" : "individual",
          batch_id: currentBatchId,
          livestock_ids: currentLivestockIds,
          file: null,
        });
        setAssignByBatch(isBatch);
        setSelectedFile(null);
        setLivestockSearch("");
        setSelectedLivestockIds(currentLivestockIds);

        // Prepopulate animalNamesMap with current livestock
        if (certificate.livestock && certificate.livestock.length > 0) {
          const nextMap = { ...animalNamesMap };
          certificate.livestock.forEach((animal) => {
            nextMap[animal.id] = animal.brand_number;
          });
          setAnimalNamesMap(nextMap);
        }
      } else {
        reset({
          certificate_number: "",
          issue_date: "",
          expiry_date: "",
          assign_by: "batch",
          batch_id: null,
          livestock_ids: [],
          file: null,
        });
        setAssignByBatch(true);
        setSelectedFile(null);
        setLivestockSearch("");
        setSelectedLivestockIds([]);
      }
    }
  }, [isOpen, certificate, reset]);

  const onSubmit = (data: CertificateFormData) => {
    if (certificate) {
      const payload = new FormData();
      payload.append("_method", "PUT");
      payload.append("certificate_number", data.certificate_number);
      payload.append("issue_date", data.issue_date);
      if (data.expiry_date) {
        payload.append("expiry_date", data.expiry_date);
      }
      payload.append("assign_by", data.assign_by);

      if (data.assign_by === "batch" && data.batch_id) {
        payload.append("batch_id", String(data.batch_id));
      } else if (data.assign_by === "individual" && selectedLivestockIds.length > 0) {
        selectedLivestockIds.forEach((id) => {
          payload.append("livestock_ids[]", String(id));
        });
      }

      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      updateCertificate(
        { id: certificate.id, formData: payload },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createCertificate(data, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] font-montserrat max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{certificate ? "Editar Certificado" : "Registrar Certificado"}</DialogTitle>
          <DialogDescription>
            {certificate 
              ? "Modifica los datos del certificado, reemplaza el archivo o actualiza su asignación." 
              : "Registra los datos del certificado y asígnalo de manera masiva a un lote (foto fija) o de forma individual a animales seleccionados."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Número de Certificado */}
          <div className="space-y-2">
            <Label htmlFor="certificate_number">Número de Certificado</Label>
            <Input
              id="certificate_number"
              placeholder="Ej. CERT-SAN-2026-909"
              {...register("certificate_number")}
            />
            {errors.certificate_number && (
              <p className="text-sm text-destructive">{errors.certificate_number.message}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Fecha Expedición</Label>
              <Input
                id="issue_date"
                type="date"
                {...register("issue_date")}
              />
              {errors.issue_date && (
                <p className="text-sm text-destructive">{errors.issue_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Fecha Vencimiento</Label>
              <Input
                id="expiry_date"
                type="date"
                {...register("expiry_date")}
              />
              {errors.expiry_date && (
                <p className="text-sm text-destructive">{errors.expiry_date.message}</p>
              )}
            </div>
          </div>

          {/* Switch de Asignación */}
          <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Asignar a un Lote Completo</Label>
              <span className="text-xs text-muted-foreground block max-w-[320px]">
                {assignByBatch
                  ? "El certificado se aplicará a todos los animales actualmente en el lote."
                  : "El certificado se asociará solo a los animales elegidos a mano."}
              </span>
            </div>
            <Switch
              checked={assignByBatch}
              onCheckedChange={(checked) => {
                setAssignByBatch(checked);
                setValue("assign_by", checked ? "batch" : "individual");
                setValue("batch_id", null);
                setValue("livestock_ids", []);
                setSelectedLivestockIds([]);
              }}
            />
          </div>

          {/* Campo condicional Lote */}
          {assignByBatch ? (
            <div className="space-y-2">
              <Label>Lote Destino</Label>
              <Controller
                name="batch_id"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value}
                    onChange={(val) => field.onChange(val ? Number(val) : null)}
                    options={batches.map((b) => ({ id: b.id, name: `${b.name} (${b.code})` }))}
                    placeholder="Selecciona el lote contenedor..."
                    searchPlaceholder="Buscar lote..."
                  />
                )}
              />
              {errors.batch_id && (
                <p className="text-sm text-destructive">{errors.batch_id.message}</p>
              )}
            </div>
          ) : (
            /* Campo condicional Animales */
            <div className="space-y-2">
              <Label>Elegir Animales</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por marca/arete..."
                  value={livestockSearch}
                  onChange={(e) => setLivestockSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Lista scrollable de animales */}
              <div className="border rounded-md p-2 h-40 overflow-y-auto space-y-1 bg-background">
                {isLoadingLivestock ? (
                  <div className="text-center text-sm text-muted-foreground py-8">Cargando...</div>
                ) : livestock.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">No se encontraron animales.</div>
                ) : (
                  livestock.map((animal) => {
                    const isChecked = selectedLivestockIds.includes(animal.id);
                    return (
                      <div key={animal.id} className="flex items-center space-x-2 p-1.5 hover:bg-muted/50 rounded-sm">
                        <Checkbox
                          id={`animal-${animal.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              const next = [...selectedLivestockIds, animal.id];
                              setSelectedLivestockIds(next);
                              setValue("livestock_ids", next);
                            } else {
                              const next = selectedLivestockIds.filter((id) => id !== animal.id);
                              setSelectedLivestockIds(next);
                              setValue("livestock_ids", next);
                            }
                          }}
                        />
                        <label
                          htmlFor={`animal-${animal.id}`}
                          className="text-sm font-medium leading-none cursor-pointer flex-1 flex justify-between"
                        >
                          <span>{animal.brand_number}</span>
                          <span className="text-xs text-muted-foreground">{animal.name || "Sin nombre"}</span>
                        </label>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Tags de Animales Seleccionados */}
              {selectedLivestockIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto p-1.5 border rounded-sm bg-muted/10">
                  {selectedLivestockIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full"
                    >
                      {animalNamesMap[id] || `#${id}`}
                      <button
                        type="button"
                        onClick={() => {
                          const next = selectedLivestockIds.filter((x) => x !== id);
                          setSelectedLivestockIds(next);
                          setValue("livestock_ids", next);
                        }}
                        className="hover:text-destructive text-muted-foreground font-bold text-xs"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{selectedLivestockIds.length} seleccionados</span>
                {selectedLivestockIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLivestockIds([]);
                      setValue("livestock_ids", []);
                    }}
                    className="text-destructive hover:underline"
                  >
                    Limpiar selección
                  </button>
                )}
              </div>
              {errors.livestock_ids && (
                <p className="text-sm text-destructive">{errors.livestock_ids.message}</p>
              )}
            </div>
          )}

          {/* Subida Opcional del Archivo */}
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>Documento del Certificado (Opcional)</span>
              {certificate?.file_path && !selectedFile && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                  Ya tiene archivo adjunto
                </span>
              )}
            </Label>
            {selectedFile ? (
              <div className="flex items-center justify-between p-2.5 border rounded-md bg-secondary/25">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setValue("file", null);
                  }}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive active:scale-95"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/20 transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setValue("file", file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <span className="text-sm font-medium block text-muted-foreground">
                  Haz clic o arrastra un archivo aquí
                </span>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  PDF, PNG o JPG (Máximo 5MB)
                </span>
              </div>
            )}
          </div>

          {/* Alertas generales de refinamiento de Zod */}
          {errors.assign_by && (
            <p className="text-sm text-destructive font-semibold">{errors.assign_by.message}</p>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/95 text-primary-foreground active:scale-95 transition-transform"
            >
              {isSaving ? "Guardando..." : (certificate ? "Guardar Cambios" : "Registrar Certificado")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
