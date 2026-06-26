import { api } from "@/lib/api";

export const logout = async (): Promise<void> => {
  await api.post("/logout");
};
