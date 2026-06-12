import { createContext, useContext } from "react";
import type { User } from "../types/types";

export type UserContextType = {
  user: User | null;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }

  return ctx;
}