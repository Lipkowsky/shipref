import { useCallback, useEffect, useState } from "react";
import type { RivalryPopulated } from "../types/types";
import { useApi } from "../api/useApi";

export function useRivalries() {
  const { apiFetch } = useApi(); 

  const [rivalries, setRivalries] = useState<RivalryPopulated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getRivalries = async () => {
    const res = await apiFetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/rivalry/rivalries`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch rivalries");
    }

    return res.json();
  };

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