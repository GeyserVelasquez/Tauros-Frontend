"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, User, Syringe, Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTreatmentApplicationsList, useApplyTreatmentApplication, useUnapplyTreatmentApplication } from "../hooks/useTreatmentApplications";
import { TreatmentApplication } from "../types";
import { useTechnicians } from "@/features/technicians/hooks/useTechnicians";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TreatmentCalendar() {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  // Interactive filters (state)
  const [searchBrand, setSearchBrand] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING_OVERDUE, COMPLETED

  // Day list detail modal/drawer
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

  // Apply Dosis Form State
  const [selectedApp, setSelectedApp] = useState<TreatmentApplication | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [quantityUsed, setQuantityUsed] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [applyError, setApplyError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load treatment applications list
  const { data: appsData, isLoading } = useTreatmentApplicationsList({
    "filter[scheduled_date_between]": `${year}-${String(month + 1).padStart(2, "0")}-01,${year}-${String(month + 1).padStart(2, "0")}-31`,
    include: "livestock,clinicalTreatment,supply,appliedBy",
  });

  const { data: technicians } = useTechnicians();

  const applyMutation = useApplyTreatmentApplication();
  const unapplyMutation = useUnapplyTreatmentApplication();

  const rawApplications = useMemo(() => appsData?.data || [], [appsData]);

  // Client-Side filtering for Search and Status (Zero Latency UX)
  const filteredApplications = useMemo(() => {
    return rawApplications.filter((app) => {
      // 1. Search by brand_number
      const matchesSearch = searchBrand
        ? app.livestock?.brand_number?.toLowerCase().includes(searchBrand.toLowerCase())
        : true;

      if (!matchesSearch) return false;

      // 2. Filter by status
      const completed = !!app.applied_at;
      const isOverdue = !completed && new Date(app.scheduled_date) < new Date();

      if (statusFilter === "COMPLETED") {
        return completed;
      }
      if (statusFilter === "PENDING_OVERDUE") {
        return !completed; // shows both pending and overdue
      }

      return true; // ALL
    });
  }, [rawApplications, searchBrand, statusFilter]);

  // Calendar cell logic
  const monthDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
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

  const yearsOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const list = [];
    for (let y = currentYear - 3; y <= currentYear + 3; y++) {
      list.push(y);
    }
    return list;
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppsForDay = (date: Date) => {
    return filteredApplications.filter((app) => {
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
      // Refresh list modal if open
      if (selectedDayDate) {
        setSelectedDayDate(new Date(selectedDayDate)); 
      }
    } catch (err) {
      // toast shown by hook
    }
  };

  const handleUnapply = async () => {
    if (!selectedApp) return;
    try {
      await unapplyMutation.mutateAsync(selectedApp.id);
      setSelectedApp(null);
      if (selectedDayDate) {
        setSelectedDayDate(new Date(selectedDayDate)); 
      }
    } catch (err) {
      // toast shown by hook
    }
  };

  const isOverdue = (app: TreatmentApplication) => {
    return !app.applied_at && new Date(app.scheduled_date) < new Date();
  };

  return (
    <div className="font-montserrat space-y-6">
      {/* PREMIUM RESPONSIVE CONTROLS TOOLBAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-neutral-900 p-4 border rounded-xl shadow-sm border-neutral-200 dark:border-neutral-800">
        
        {/* Left Side: Navigation & Time Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 border rounded-md p-1 bg-neutral-50 dark:bg-neutral-950">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 active:scale-95 transition-transform">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 active:scale-95 transition-transform">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month selector using premium UI select */}
          <Select
            value={String(month)}
            onValueChange={(val) => setCurrentDate(new Date(year, parseInt(val), 1))}
          >
            <SelectTrigger className="w-[140px] font-semibold text-sm">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((name, idx) => (
                <SelectItem key={idx} value={String(idx)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year selector using premium UI select */}
          <Select
            value={String(year)}
            onValueChange={(val) => setCurrentDate(new Date(parseInt(val), month, 1))}
          >
            <SelectTrigger className="w-[100px] font-semibold text-sm">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {yearsOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Side: Filters, Search & Legends */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Live Search by brand_number */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-60" />
            <Input
              placeholder="Buscar por arete..."
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Status filter dropdown using premium UI select */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-full sm:w-[200px] font-semibold text-xs h-9">
              <SelectValue placeholder="Filtrar Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Estados</SelectItem>
              <SelectItem value="PENDING_OVERDUE">Solo Pendientes/Atrasados</SelectItem>
              <SelectItem value="COMPLETED">Solo Aplicados</SelectItem>
            </SelectContent>
          </Select>

          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold border-l pl-4 border-neutral-200 dark:border-neutral-800">
            <span className="flex items-center gap-1.5 text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 border border-rose-200 dark:border-rose-900/50 rounded">
              <span className="size-2 rounded-full bg-rose-500" /> Atrasado
            </span>
            <span className="flex items-center gap-1.5 text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-1 border border-blue-200 dark:border-blue-900/50 rounded">
              <span className="size-2 rounded-full bg-blue-500" /> Pendiente
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 border border-emerald-200 dark:border-emerald-900/50 rounded">
              <span className="size-2 rounded-full bg-emerald-500" /> Aplicado
            </span>
          </div>
        </div>
      </div>

      {/* CALENDAR MONTH GRID */}
      {isLoading ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-2 border rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando agenda de tratamientos...</p>
        </div>
      ) : (
        <div className="border rounded-xl bg-white dark:bg-neutral-950 overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm">
          {/* Days of week */}
          <div className="grid grid-cols-7 text-center font-semibold text-xs py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
            <div>LU</div>
            <div>MA</div>
            <div>MI</div>
            <div>JU</div>
            <div>VI</div>
            <div>SÁ</div>
            <div>DO</div>
          </div>

          {/* Days cells (Strict Height & Responsive content layout) */}
          <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-neutral-200 dark:divide-neutral-800 border-t-0">
            {monthDays.map((cell, idx) => {
              const dayApps = getAppsForDay(cell.date);
              const maxVisible = 5;
              const hasMore = dayApps.length > maxVisible;
              const visibleApps = dayApps.slice(0, maxVisible);

              return (
                <div
                  key={idx}
                  onClick={() => dayApps.length > 0 && setSelectedDayDate(cell.date)}
                  className={`p-1 sm:p-2 flex flex-col justify-between h-[120px] md:h-[135px] overflow-hidden transition-colors cursor-pointer select-none ${
                    cell.isCurrentMonth
                      ? "bg-white dark:bg-neutral-950"
                      : "bg-neutral-50/50 dark:bg-neutral-900/20 text-neutral-400"
                  } hover:bg-neutral-50 dark:hover:bg-neutral-900/50`}
                >
                  {/* Day number */}
                  <span className={`text-[10px] sm:text-xs font-semibold size-4 sm:size-5 rounded-full flex items-center justify-center ${
                    cell.date.toDateString() === new Date().toDateString()
                      ? "bg-primary text-primary-foreground font-bold"
                      : ""
                  }`}>
                    {cell.day}
                  </span>

                  {/* Daily items */}
                  <div className="flex-1 overflow-hidden space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1 pr-0.5">
                    {visibleApps.map((app) => {
                      const completed = !!app.applied_at;
                      const overdue = isOverdue(app);
                      return (
                        <div
                          key={app.id}
                          onClick={(e) => {
                            // Prevent bubbling to day list dialog click
                            e.stopPropagation();
                            handleOpenAppDetails(app);
                          }}
                          className={`w-full text-left truncate text-[10px] leading-tight px-0.5 sm:px-1.5 py-0 sm:py-0.5 rounded font-medium border transition-colors cursor-pointer ${
                            completed
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                              : overdue
                              ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50"
                              : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50"
                          }`}
                        >
                          {/* Desktop: Brand + Treatment name. Mobile: just Brand number (max 10 chars) */}
                          <span className="hidden sm:inline">
                            {app.livestock?.brand_number}: {app.clinical_treatment?.name}
                          </span>
                          <span className="inline sm:hidden truncate max-w-full">
                            {app.livestock?.brand_number?.substring(0, 10)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overlap Indicator / Three dots */}
                  {hasMore && (
                    <div className="text-[8px] sm:text-[10px] text-center font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 py-0 sm:py-0.5 rounded border border-neutral-200 dark:border-neutral-700 animate-pulse mt-0.5 sm:mt-1 shrink-0">
                      + {dayApps.length - maxVisible} más
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY EVENTS LIST MODAL / DRAWER */}
      {selectedDayDate && (
        <Dialog open={!!selectedDayDate} onOpenChange={(open) => !open && setSelectedDayDate(null)}>
          <DialogContent className="max-w-md font-montserrat max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tareas agendadas</DialogTitle>
              <DialogDescription>
                {selectedDayDate.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-4">
              {getAppsForDay(selectedDayDate).map((app) => {
                const completed = !!app.applied_at;
                const overdue = isOverdue(app);
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedDayDate(null);
                      handleOpenAppDetails(app);
                    }}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                      completed
                        ? "border-emerald-100 bg-emerald-50/20 text-emerald-950 dark:border-emerald-950 dark:bg-emerald-950/10 dark:text-emerald-400"
                        : overdue
                        ? "border-rose-100 bg-rose-50/20 text-rose-950 dark:border-rose-950 dark:bg-rose-950/10 dark:text-rose-400"
                        : "border-blue-100 bg-blue-50/20 text-blue-950 dark:border-blue-950 dark:bg-blue-950/10 dark:text-blue-400"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs tracking-wider uppercase">
                        Vaca: {app.livestock?.brand_number}
                      </div>
                      <div className="font-bold text-sm mt-0.5">
                        {app.clinical_treatment?.name}
                      </div>
                      {app.supply && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {app.quantity_formatted} unidades de {app.supply.name}
                        </div>
                      )}
                    </div>
                    <div>
                      {completed ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Aplicado
                        </span>
                      ) : overdue ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Atrasado
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
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
                    {selectedApp.livestock?.brand_number} - {selectedApp.livestock?.name}
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
                  {applyError && <span className="text-xs text-rose-500 font-semibold">{applyError}</span>}
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
