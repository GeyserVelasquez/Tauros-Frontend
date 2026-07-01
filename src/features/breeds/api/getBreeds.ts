import { api } from "@/lib/api";
import { Breed } from "../types";

export async function getBreeds(): Promise<Breed[]> {
  const { data } = await api.get<{ data: Breed[] }>("/breeds");
  return data.data;
}
