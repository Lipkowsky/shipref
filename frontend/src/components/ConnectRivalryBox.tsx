import { useState } from "react";
import { useApi } from "../api/useApi";
type Props = {
  onSuccess: () => Promise<void>;
};

export default function ConnectRivalryBox({ onSuccess }: Props) {
  const [playerId, setPlayerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { apiFetch } = useApi(); 
  

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/rivalry/connect`,
        {
          method: "POST",
          body: JSON.stringify({ playerId }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to connect rivalry");
      }

      setSuccess(true);
      await onSuccess();
      setPlayerId("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="flex flex-col w-full gap-2 rounded-md bg-gray-900 px-5 py-3 text-white">
  
  {/* TOP ROW */}
  <div className="flex flex-col sm:flex-row w-full items-center gap-3">
    
    <h2 className="text-sm font-semibold whitespace-nowrap shrink-0">
      Dodaj rywala po ID
    </h2>

    <input
      value={playerId}
      onChange={(e) => setPlayerId(e.target.value)}
      placeholder="Wpisz playerId..."
      className="w-full  p-2  rounded bg-gray-800 text-white border border-transparent focus:border-gray-600 focus:outline-none"
    
    />

    <button
      onClick={handleConnect}
      disabled={loading || !playerId}
      className="w-full sm:w-auto shrink-0 px-4 py-2  rounded border border-gray-700 bg-gray-700 text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
    >
      {loading ? "Łączenie..." : "Dodaj rywalizację"}
    </button>

  </div>

  {/* MESSAGES */}
  {success && (
    <p className="text-green-400 text-sm font-medium">
      ✓ Rywalizacja dodana pomyślnie!
    </p>
  )}

  {error && (
    <p className="text-red-400 text-sm font-medium">
      ⚠ {error}
    </p>
  )}
</div>
  );
}
