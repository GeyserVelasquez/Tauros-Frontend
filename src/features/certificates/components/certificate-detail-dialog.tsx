"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, ShieldCheck, Download, Layers } from "lucide-react";
import { Certificate } from "../types";

interface CertificateDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: Certificate | null;
}

export function CertificateDetailDialog({ isOpen, onOpenChange, certificate }: CertificateDetailDialogProps) {
  if (!certificate) return null;

  const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000").replace(/\/$/, "");
  const fileUrl = certificate.file_path
    ? `${baseUrl}/storage/${certificate.file_path.replace(/^\//, "")}`
    : null;

  const getExpiryStatus = (expiryDateStr: string | null) => {
    if (!expiryDateStr) {
      return {
        label: "Sin vencimiento",
        className: "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800/50",
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: "Vencido",
        className: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/50",
      };
    } else if (diffDays <= 30) {
      return {
        label: `Vence en ${diffDays} días`,
        className: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
      };
    } else {
      return {
        label: "Activo",
        className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
      };
    }
  };

  const status = getExpiryStatus(certificate.expiry_date);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return localDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }
      return new Date(dateStr).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const batchesList = certificate.batches || [];
  const livestockList = certificate.livestock || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] font-montserrat max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Certificado {certificate.certificate_number}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Información técnica y detalle de asignación.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Metadatos Generales */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b text-sm shrink-0">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Fecha Expedición</span>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatDate(certificate.issue_date)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Fecha Vencimiento</span>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatDate(certificate.expiry_date)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Estado de Vigencia</span>
            <Badge variant="outline" className={`${status.className} font-semibold mt-0.5`}>
              {status.label}
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Documento Digital</span>
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold mt-1"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar Documento
              </a>
            ) : (
              <span className="text-xs text-muted-foreground block mt-1">Sin archivo adjunto</span>
            )}
          </div>
        </div>

        {/* Listados de Asignación */}
        <div className="flex-1 min-h-0 pt-4 flex flex-col">
          <Tabs defaultValue="animals" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid grid-cols-2 shrink-0">
              <TabsTrigger value="animals" className="text-sm font-semibold">
                Animales ({livestockList.length})
              </TabsTrigger>
              <TabsTrigger value="batches" className="text-sm font-semibold">
                Lotes ({batchesList.length})
              </TabsTrigger>
            </TabsList>

            {/* Panel Animales */}
            <TabsContent value="animals" className="flex-1 min-h-0 mt-3 overflow-y-auto">
              {livestockList.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-12">
                  No hay animales individuales asociados a este certificado.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {livestockList.map((animal) => (
                    <div
                      key={animal.id}
                      className="flex items-center justify-between p-2.5 rounded-md border bg-muted/15"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-semibold text-foreground truncate">
                          {animal.brand_number}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {animal.name || "Sin nombre"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Panel Lotes */}
            <TabsContent value="batches" className="flex-1 min-h-0 mt-3 overflow-y-auto">
              {batchesList.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-12">
                  Este certificado no se ha asignado a ningún lote contenedor.
                </div>
              ) : (
                <div className="space-y-2">
                  {batchesList.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-muted/15"
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-semibold text-foreground">
                          {batch.name}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Código: {batch.code}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
