"use client";

import * as React from "react";
import { FileText, Trash2, ExternalLink, Calendar, Search, Eye, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCertificateList } from "../hooks/useCertificates";
import { useDeleteCertificate } from "../hooks/useMutateCertificates";
import { CertificateDeleteDialog } from "./certificate-delete-dialog";
import { CertificateDetailDialog } from "./certificate-detail-dialog";
import { Certificate } from "../types";
import { TableActions } from "@/components/ui/table-actions";

interface CertificateTableProps {
  onCreateTrigger: boolean;
  onCreateTriggerChange: (trigger: boolean) => void;
  onEditTrigger: (cert: Certificate) => void;
}

export function CertificateTable({ onCreateTrigger, onCreateTriggerChange, onEditTrigger }: CertificateTableProps) {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedToDelete, setSelectedToDelete] = React.useState<Certificate | null>(null);
  const [selectedToView, setSelectedToView] = React.useState<Certificate | null>(null);

  const { data: certificatesResponse, isLoading } = useCertificateList({
    page,
    per_page: 15,
    search,
    include: "batches,livestock",
  });

  const certificates = certificatesResponse?.data || [];
  const meta = certificatesResponse?.meta || { current_page: 1, last_page: 1, total: 0 };

  const { mutate: deleteCertificate, isPending: isDeleting } = useDeleteCertificate();

  // Reset page when search changes
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDeleteConfirm = () => {
    if (!selectedToDelete) return;
    deleteCertificate(selectedToDelete.id, {
      onSuccess: () => {
        setSelectedToDelete(null);
      },
    });
  };

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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return localDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      return new Date(dateStr).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getAssignmentText = (cert: Certificate) => {
    if (cert.batches && cert.batches.length > 0) {
      return `Lote: ${cert.batches.map((b) => b.name).join(", ")}`;
    }
    if (cert.livestock && cert.livestock.length > 0) {
      const count = cert.livestock.length;
      return `${count} ${count === 1 ? "animal" : "animales"}`;
    }
    return "No asignado";
  };

  return (
    <div className="space-y-4 font-montserrat">
      {/* Barra de Filtro */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de certificado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Total: {meta.total || 0} certificados
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nro. Certificado</TableHead>
              <TableHead>Fecha Expedición</TableHead>
              <TableHead>Fecha Vencimiento</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead>Asignado A</TableHead>
              <TableHead className="text-center">Documento</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto rounded-md" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se encontraron certificados registrados.
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => {
                const status = getExpiryStatus(cert.expiry_date);
                const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000").replace(/\/$/, "");
                const fileUrl = cert.file_path
                  ? `${baseUrl}/storage/${cert.file_path.replace(/^\//, "")}`
                  : null;

                return (
                  <TableRow key={cert.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-semibold text-foreground">
                      <button
                        onClick={() => setSelectedToView(cert)}
                        className="hover:underline hover:text-primary text-left transition-colors font-semibold"
                      >
                        {cert.certificate_number}
                      </button>
                    </TableCell>
                    <TableCell>{formatDate(cert.issue_date)}</TableCell>
                    <TableCell>{formatDate(cert.expiry_date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${status.className} font-semibold py-0.5 px-2`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {getAssignmentText(cert)}
                    </TableCell>
                    <TableCell className="text-center">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <TableActions
                        actions={[
                          {
                            label: "Ver Detalles",
                            icon: Eye,
                            onClick: () => setSelectedToView(cert),
                          },
                          {
                            label: "Editar Certificado",
                            icon: Edit,
                            onClick: () => onEditTrigger(cert),
                          },
                          {
                            label: "Eliminar Certificado",
                            icon: Trash2,
                            variant: "destructive",
                            showSeparatorBefore: true,
                            onClick: () => setSelectedToDelete(cert),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {page} de {meta.last_page}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
            disabled={page === meta.last_page}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Diálogo de Eliminación */}
      <CertificateDeleteDialog
        isOpen={!!selectedToDelete}
        onOpenChange={(open) => !open && setSelectedToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Diálogo de Detalle Individual */}
      <CertificateDetailDialog
        isOpen={!!selectedToView}
        onOpenChange={(open) => !open && setSelectedToView(null)}
        certificate={selectedToView}
      />
    </div>
  );
}
