import { api } from "@/lib/api";
import { Classification } from "../types";

export async function getClassifications(): Promise<Classification[]> {
  const { data } = await api.get<{ data: Classification[] }>("/classifications");
  return data.data;
}
