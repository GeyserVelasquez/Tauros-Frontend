/**
 * Calcula el Índice de Temperatura y Humedad (THI) utilizado en ganadería bovina.
 * Fórmula: THI = (1.8 * T + 32) - [(0.55 - 0.0055 * RH) * (1.8 * T - 26)]
 * 
 * Rangos de Estrés Bóvido:
 * - <72: Normal
 * - 72-78: Alerta (Estrés leve-moderado)
 * - 79-88: Peligro (Estrés severo)
 * - >88: Emergencia (Pérdidas de producción y peligro vital)
 */
export function calculateTHI(temp: number, humidity: number): number {
  const thi = (1.8 * temp + 32) - (0.55 - 0.0055 * humidity) * (1.8 * temp - 26);
  return Math.round(thi * 10) / 10;
}

export interface THIStatus {
  label: string;
  className: string;
}

export function getTHIStatus(thi: number): THIStatus {
  if (thi < 72) {
    return {
      label: "Normal",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }
  if (thi <= 78) {
    return {
      label: "Alerta",
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  }
  if (thi <= 88) {
    return {
      label: "Peligro",
      className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    };
  }
  return {
    label: "Emergencia",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse",
  };
}
