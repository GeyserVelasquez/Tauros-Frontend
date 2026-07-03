import { api } from "@/lib/api";
import { EntryCause } from "../types";

export async function getEntryCauses(): Promise<EntryCause[]> {
  const { data } = await api.get<{ data: EntryCause[] }>("/entry-causes");
  return data.data;
}
