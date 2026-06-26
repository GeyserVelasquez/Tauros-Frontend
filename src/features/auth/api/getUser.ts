import { api } from "@/lib/api";
import { User } from "../types";

export const getUser = async (): Promise<User> => {
  const { data } = await api.get<User>("/user");
  return data;
};
