import { useCallback, useEffect, useState } from "react";
import type { RivalryPopulated } from "../types/types";

async function getRivalries() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rivalry/rivalries`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch rivalries");
  }

  return res.json();
}

export function useRivalries() {
  const [rivalries, setRivalries] = useState<RivalryPopulated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRivalries();
        setRivalries(data.rivalries);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getRivalries();
      setRivalries(data.rivalries);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { rivalries, loading, error, refetch };
}