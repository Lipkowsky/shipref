import { useAuth } from "@clerk/clerk-react";

export function useApi() {
  const { getToken } = useAuth();
  

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = await getToken();

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  };

  return { apiFetch };
}