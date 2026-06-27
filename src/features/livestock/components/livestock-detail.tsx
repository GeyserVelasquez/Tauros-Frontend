"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Calendar, User, FileText, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useLivestockById } from "../hooks/useLivestock";

interface LivestockDetailProps {
  id: string | number;
}

export function LivestockDetail({ id }: LivestockDetailProps) {
  const router = useRouter();
  
  // Cargar animal con todas sus relaciones requeridas
  const { data: animal, isLoading, error } = useLivestockById(id, {
    include: "breed,color,classification,state,entryCause,owner,technician,father,mother,adoptiveMother,receivingMother,currentBatchMovement",
  });

  if (isLoading) {
    return (
      <div className="space-y-6 font-montserrat">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[150px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="p-8 text-center font-montserrat">
        <h2 className="text-xl font-semibold text-red-500">Error al cargar la ficha del animal</h2>
        <p className="mt-2 text-muted-foreground">El animal seleccionado no existe o hubo un problema de conexión.</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/livestock")}>
          Volver al Inventario
        </Button>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    bull: "Toro",
    steer: "Novillo",
    male_yearling: "Torete",
    bull_calf: "Becerro (Macho)",
    cow: "Vaca",
    heifer: "Novilla",
    female_yearling: "Vaquitona",
    heifer_calf: "Becerro (Hembra)",
  };

  return (
    <div className="space-y-6 font-montserrat">
      {/* Botones de Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/livestock")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Inventario
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ficha: {animal.brand_number}
            </h1>
            <p className="text-sm text-muted-foreground">
              Nombre: {animal.name || "Sin nombre registrado"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground">
            <Link href={`/dashboard/livestock/${animal.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Ficha
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Grid de Secciones */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Ficha Básica y Operativa */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 opacity-75" />
              Datos de Operación
            </CardTitle>
            <CardDescription>Estado vital y administrativo del animal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</span>
                <p className="font-medium text-sm mt-0.5">{categoryLabels[animal.animal_category] || animal.animal_category}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Código de Chip</span>
                <p className="font-medium text-sm mt-0.5">{animal.electronic_code || "—"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado Vital</span>
                <div className="mt-1">
                  <Badge variant={animal.is_alive ? "default" : "destructive"}>
                    {animal.is_alive ? "Vivo" : "Muerto"}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Habilitado</span>
                <div className="mt-1">
                  <Badge variant={animal.is_enabled ? "outline" : "secondary"}>
                    {animal.is_enabled ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado Productivo</span>
                <p className="font-medium text-sm mt-0.5">{animal.state?.name || "—"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lote</span>
                <p className="font-medium text-sm mt-0.5">{animal.batch?.name || "Sin Lote"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Origen e Historial de Ingreso */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 opacity-75" />
              Origen y Fechas
            </CardTitle>
            <CardDescription>Fechas de nacimiento, ingreso e historial de procedencia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha Nacimiento</span>
                <p className="font-medium text-sm mt-0.5">{animal.birth_date || "No registrada"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha Ingreso</span>
                <p className="font-medium text-sm mt-0.5">{animal.entry_date || "No registrada"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Causa de Ingreso</span>
                <p className="font-medium text-sm mt-0.5">{animal.entry_cause?.name || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Morfología y Taxonomía */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 opacity-75" />
              Morfología y Atributos
            </CardTitle>
            <CardDescription>Características físicas del animal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Raza</span>
                <p className="font-medium text-sm mt-0.5">{animal.breed?.name || "No definida"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</span>
                <p className="font-medium text-sm mt-0.5">{animal.color?.name || "No definido"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clasificación</span>
                <p className="font-medium text-sm mt-0.5">{animal.classification?.name || "No clasificado"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cantidad de Tetas</span>
                <p className="font-medium text-sm mt-0.5">{animal.tits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asignación y Genealogía */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 opacity-75" />
              Genealogía y Responsables
            </CardTitle>
            <CardDescription>Familia del animal y personal a cargo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Propietario</span>
                <p className="font-medium text-sm mt-0.5">{animal.owner?.name || "—"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Médico Veterinario</span>
                <p className="font-medium text-sm mt-0.5">{animal.technician?.name || "—"}</p>
              </div>

              <div className="col-span-2">
                <Separator className="my-2" />
                <h4 className="text-sm font-semibold mb-2">Árbol Genealógico</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Padre (Toro):</span>
                    {animal.father ? (
                      <Link href={`/dashboard/livestock/${animal.father.id}`} className="font-medium underline hover:text-primary">
                        {animal.father.brand_number} {animal.father.name ? `(${animal.father.name})` : ""}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Sin registrar</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Madre Biológica:</span>
                    {animal.mother ? (
                      <Link href={`/dashboard/livestock/${animal.mother.id}`} className="font-medium underline hover:text-primary">
                        {animal.mother.brand_number} {animal.mother.name ? `(${animal.mother.name})` : ""}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Sin registrar</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Madre Adoptiva:</span>
                    {animal.adoptive_mother ? (
                      <Link href={`/dashboard/livestock/${animal.adoptive_mother.id}`} className="font-medium underline hover:text-primary">
                        {animal.adoptive_mother.brand_number}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Sin registrar</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Madre Receptora:</span>
                    {animal.receiving_mother ? (
                      <Link href={`/dashboard/livestock/${animal.receiving_mother.id}`} className="font-medium underline hover:text-primary">
                        {animal.receiving_mother.brand_number}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Sin registrar</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observaciones generales */}
      {animal.general_comment && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Observaciones / Comentarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{animal.general_comment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
