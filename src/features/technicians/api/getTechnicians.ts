import { api } from "@/lib/api";
import { Technician } from "../types";

export async function getTechnicians(): Promise<Technician[]> {
  const { data } = await api.get<{ data: Technician[] }>("/technicians");
  return data.data;
}
