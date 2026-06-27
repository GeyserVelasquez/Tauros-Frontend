import { useQuery } from "@tanstack/react-query";
import {
  getBreeds,
  getColors,
  getClassifications,
  getEntryCauses,
  getStates,
  getOwners,
  getTechnicians,
} from "../api/getDropdownOptions";

export function useBreeds() {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: getBreeds,
    staleTime: 24 * 60 * 60 * 1000, // Cache de 24 horas para catálogos estáticos
  });
}

export function useColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useClassifications() {
  return useQuery({
    queryKey: ["classifications"],
    queryFn: getClassifications,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useEntryCauses() {
  return useQuery({
    queryKey: ["entry-causes"],
    queryFn: getEntryCauses,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: getStates,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useOwners() {
  return useQuery({
    queryKey: ["owners"],
    queryFn: getOwners,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useTechnicians() {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
