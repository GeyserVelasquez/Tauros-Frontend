import { api } from "@/lib/api";
import { Color } from "../types";

export async function getColors(): Promise<Color[]> {
  const { data } = await api.get<{ data: Color[] }>("/colors");
  return data.data;
}
