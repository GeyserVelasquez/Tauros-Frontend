export interface Supply {
  id: number;
  code: string;
  name: string;
  attributes: Record<string, string> | null;
  supply_type_id: number;
  created_at: string;
  updated_at: string;
}
