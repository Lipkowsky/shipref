import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User } from "../types/types";
import { useAuth } from "@clerk/clerk-react";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, getToken } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const token = await getToken({
        template: "jwt-template-name",
      });
      console.log("Custom Token:", token);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/me`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [isSignedIn]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}
