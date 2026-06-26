import { api } from "@/lib/api";
import { LoginCredentials } from "../types";

export const login = async (credentials: LoginCredentials): Promise<void> => {
  await api.post("/login", credentials);
};
