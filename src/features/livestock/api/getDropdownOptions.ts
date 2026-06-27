import { api } from "@/lib/api";

export interface LookupItem {
  id: number;
  name: string;
}

export async function getBreeds(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/breeds");
  return data.data;
}

export async function getColors(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/colors");
  return data.data;
}

export async function getClassifications(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/classifications");
  return data.data;
}

export async function getEntryCauses(): Promise<LookupItem[]> {
  const response = await api.get<{ data: LookupItem[] }>("/entry-causes");
  return response.data.data;
}

export async function getStates(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/states");
  return data.data;
}

export async function getOwners(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/owners");
  return data.data;
}

export async function getTechnicians(): Promise<LookupItem[]> {
  const { data } = await api.get<{ data: LookupItem[] }>("/technicians");
  return data.data;
}
