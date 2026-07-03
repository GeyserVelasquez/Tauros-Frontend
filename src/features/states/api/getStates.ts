import { api } from "@/lib/api";
import { State } from "../types";

export async function getStates(): Promise<State[]> {
  const { data } = await api.get<{ data: State[] }>("/states");
  return data.data;
}
