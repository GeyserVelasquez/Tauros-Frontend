"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, User, Syringe, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTreatmentApplicationsList, useApplyTreatmentApplication, useUnapplyTreatmentApplication } from "../hooks/useTreatmentApplications";
import { TreatmentApplication } from "../types";
import { useTechnicians } from "@/features/technicians/hooks/useTechnicians";

export function TreatmentCalendar() {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedApp, setSelectedApp] = useState<TreatmentApplication | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Apply Dosis Form State
  const [quantityUsed, setQuantityUsed] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [applyError, setApplyError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load treatment applications list
  const { data: appsData, isLoading } = useTreatmentApplicationsList({
    // filter within the current month range (plus/minus padding days)
    "filter[scheduled_date_between]": `${year}-${String(month + 1).padStart(2, "0")}-01,${year}-${String(month + 1).padStart(2, "0")}-31`,
    include: "livestock,clinicalTreatment,supply,appliedBy",
  });

  const { data: technicians } = useTechnicians();

  const applyMutation = useApplyTreatmentApplication();
  const unapplyMutation = useUnapplyTreatmentApplication();

  const applications = useMemo(() => appsData?.data || [], [appsData]);

  // Calendar calculations
  const monthDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust to Monday start: 0->6, 1->0, 2->1, etc.
    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDaysTotal = new Date(year, month, 0).getDate();

    const days = [];

    // Pad previous month days
    for (let i = adjustedFirstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDaysTotal - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDaysTotal - i),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Pad next month days to complete grid
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [year, month]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppsForDay = (date: Date) => {
    return applications.filter((app) => {
      if (!app.scheduled_date) return false;
      const datePart = app.scheduled_date.split(/[\sT]/)[0];
      const [appYear, appMonth, appDay] = datePart.split("-").map(Number);
      return (
        appYear === date.getFullYear() &&
        (appMonth - 1) === date.getMonth() &&
        appDay === date.getDate()
      );
    });
  };

  const handleOpenAppDetails = (app: TreatmentApplication) => {
    setSelectedApp(app);
  };

  const handleOpenApply = () => {
    if (!selectedApp) return;
    setQuantityUsed(String(selectedApp.quantity / 100));
    setTechnicianId(selectedApp.applied_by_id ? String(selectedApp.applied_by_id) : "");
    setApplyError("");
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    if (!quantityUsed || parseFloat(quantityUsed) <= 0) {
      setApplyError("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      await applyMutation.mutateAsync({
        id: selectedApp.id,
        formData: {
          quantity_used: parseFloat(quantityUsed),
          applied_by_id: technicianId ? parseInt(technicianId) : null,
        },
      });
      setShowApplyModal(false);
      setSelectedApp(null);
    } catch (err) {
      // toast shown by hook
    }
  };

  const handleUnapply = async () => {
    if (!selectedApp) return;
    try {
      await unapplyMutation.mutateAsync(selectedApp.id);
      setSelectedApp(null);
    } catch (err) {
      // toast shown by hook
    }
  };

  // Check if a scheduled date has passed and hasn't been applied
  const isOverdue = (app: TreatmentApplication) => {
    return !app.applied_at && new Date(app.scheduled_date) < new Date();
  };

  return (
    <div className="font-montserrat space-y-4">
      {/* CALENDAR HEADER */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-4 border rounded-lg border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-9 w-9">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      {isLoading ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-2 border rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando agenda de tratamientos...</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white dark:bg-neutral-950 overflow-hidden border-neutral-200 dark:border-neutral-800">
          {/* Days of week */}
          <div className="grid grid-cols-7 text-center font-semibold text-xs py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
            <div>LU</div>
            <div>MA</div>
            <div>MI</div>
            <div>JU</div>
            <div>VI</div>
            <div>SÁ</div>
            <div>DO</div>
          </div>

          {/* Days cells */}
          <div className="grid grid-cols-7 grid-rows-6 auto-rows-[100px] divide-x divide-y divide-neutral-200 dark:divide-neutral-800">
            {monthDays.map((cell, idx) => {
              const dayApps = getAppsForDay(cell.date);
              return (
                <div
                  key={idx}
                  className={`p-1.5 flex flex-col justify-between overflow-hidden transition-colors ${
                    cell.isCurrentMonth
                      ? "bg-white dark:bg-neutral-950"
                      : "bg-neutral-50/50 dark:bg-neutral-900/20 text-neutral-400"
                  } hover:bg-neutral-50 dark:hover:bg-neutral-900/50`}
                >
                  {/* Day number */}
                  <span className={`text-xs font-semibold ${
                    cell.date.toDateString() === new Date().toDateString()
                      ? "bg-primary text-primary-foreground size-5 rounded-full flex items-center justify-center font-bold"
                      : ""
                  }`}>
                    {cell.day}
                  </span>

                  {/* Daily items */}
                  <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5">
                    {dayApps.map((app) => {
                      const completed = !!app.applied_at;
                      const overdue = isOverdue(app);
                      return (
                        <button
                          key={app.id}
                          onClick={() => handleOpenAppDetails(app)}
                          className={`w-full text-left truncate text-[10px] leading-tight px-1.5 py-0.5 rounded font-medium border transition-colors ${
                            completed
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                              : overdue
                              ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50"
                              : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50"
                          }`}
                        >
                          {app.livestock?.brand_number}: {app.clinical_treatment?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-md font-montserrat">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Detalle de Aplicación</DialogTitle>
                <div className="flex gap-1 items-center">
                  {selectedApp.applied_at ? (
                    <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <CheckCircle className="h-3 w-3" /> Aplicado
                    </span>
                  ) : isOverdue(selectedApp) ? (
                    <span className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <AlertTriangle className="h-3 w-3" /> Atrasado
                    </span>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <Clock className="h-3 w-3" /> Pendiente
                    </span>
                  )}
                </div>
              </div>
              <DialogDescription>
                Información de dosificación para el animal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b pb-3 border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Animal</span>
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">
                    {selectedApp.livestock?.code} - {selectedApp.livestock?.name}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Tratamiento</span>
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">
                    {selectedApp.clinical_treatment?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-3 border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Insumo Requerido</span>
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">
                    {selectedApp.supply?.name || "Sin insumo"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Dosis Programada</span>
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">
                    {selectedApp.quantity_formatted} unidades
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Fecha Programada</span>
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">
                    {new Date(selectedApp.scheduled_date).toLocaleDateString()} {new Date(selectedApp.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {selectedApp.applied_at && (
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold">Aplicado Por</span>
                    <p className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 opacity-55" />
                      {selectedApp.applied_by?.name || "Técnico"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 border-t pt-4 border-neutral-100 dark:border-neutral-800">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>Cerrar</Button>
              {selectedApp.applied_at ? (
                <Button variant="destructive" onClick={handleUnapply} disabled={unapplyMutation.isPending}>
                  Revertir Aplicación
                </Button>
              ) : (
                <Button onClick={handleOpenApply} className="flex items-center gap-1">
                  <Syringe className="h-4 w-4" /> Registrar Aplicación
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* QUICK APPLY DIALOG */}
      {showApplyModal && selectedApp && (
        <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
          <DialogContent className="max-w-md font-montserrat">
            <DialogHeader>
              <DialogTitle>Confirmar Aplicación Física</DialogTitle>
              <DialogDescription>
                Verifique y confirme la cantidad de dosis inyectada o suministrada.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <Field data-invalid={!!applyError}>
                <FieldLabel htmlFor="quantityUsed">Cantidad Real Aplicada *</FieldLabel>
                <FieldContent>
                  <Input
                    id="quantityUsed"
                    type="number"
                    step="0.01"
                    value={quantityUsed}
                    onChange={(e) => setQuantityUsed(e.target.value)}
                    required
                  />
                  {applyError && <span className="text-xs text-red-500 font-semibold">{applyError}</span>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="technicianSelect">Aplicado Por (Técnico) *</FieldLabel>
                <FieldContent>
                  <select
                    id="technicianSelect"
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                    className="w-full border rounded-md h-10 px-3 bg-background border-neutral-200 dark:border-neutral-800 font-montserrat text-sm"
                    required
                  >
                    <option value="">Seleccionar técnico...</option>
                    {(technicians || []).map((tech: any) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </FieldContent>
              </Field>

              <DialogFooter className="gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={applyMutation.isPending}>
                  {applyMutation.isPending ? "Guardando..." : "Confirmar Dosis"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
