"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  livestock: "Ganado",
  batches: "Lotes",
  paddocks: "Potreros",
  certificates: "Certificados",
  outcomes: "Salidas",
  reproduction: "Reproducción",
  services: "Servicios",
  revisions: "Revisiones",
  births: "Partos",
  aborts: "Abortos",
  extractions: "Extracciones",
  health: "Salud",
  "clinic-histories": "Historias Clínicas",
  agenda: "Calendario / Agenda",
  diagnostics: "Diagnósticos",
  treatments: "Tratamientos",
  production: "Producción",
  milkings: "Ordeños",
  growths: "Pesajes",
  weather: "Clima",
  temperature: "Temperatura",
  humidity: "Humedad",
  payments: "Pagos",
  create: "Crear",
  edit: "Editar",
};

const getLabel = (segment: string): string => {
  if (ROUTE_LABELS[segment]) {
    return ROUTE_LABELS[segment];
  }
  // Fallback: Replace hyphens/underscores with spaces and capitalize words
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // Split path segments and remove empty ones
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = getLabel(segment);

          return (
            <React.Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
