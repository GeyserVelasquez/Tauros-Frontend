import { api } from "@/lib/api";
import { Supply } from "../types";

export async function getSupplies(): Promise<Supply[]> {
  const { data } = await api.get<{ data: Supply[] }>("/supplies");
  return data.data;
}
