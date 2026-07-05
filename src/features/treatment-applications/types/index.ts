export interface TreatmentApplication {
  id: number;
  livestock_id: number;
  clinical_treatment_id: number;
  supply_id: number | null;
  dose_number: number | null;
  quantity: number;
  quantity_formatted: number;
  scheduled_date: string;
  applied_at: string | null;
  applied_by_id: number | null;
  clinic_history_id: number | null;
  sanitary_plan_id: number | null;
  created_at: string;
  updated_at: string;

  // Optional loaded relationships
  livestock?: {
    id: number;
    name: string;
    code: string;
  };
  clinical_treatment?: {
    id: number;
    code: string;
    name: string;
  };
  supply?: {
    id: number;
    code: string;
    name: string;
  };
  applied_by?: {
    id: number;
    name: string;
  };
  clinic_history?: {
    id: number;
    code: string;
    name: string;
  };
}
