import { api } from "@/lib/api";
import { Owner } from "../types";

export async function getOwners(): Promise<Owner[]> {
  const { data } = await api.get<{ data: Owner[] }>("/owners");
  return data.data;
}
