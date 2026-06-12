import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  rivalryId: string;
  type: "yellow" | "red";
  onSuccess?: () => void;
};

const giveCard = async (
  type: "yellow" | "red",
  rivalryId: string,
  reason: string,
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/cards/${type}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rivalryId,
        reason,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to give card");
  }

  return res.json();
};

export const CardModal = ({
  open,
  onClose,
  rivalryId,
  type,
  onSuccess,
}: Props) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await giveCard(type, rivalryId, reason);

      setReason("");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded-lg w-[90%] max-w-md border border-gray-700">
        <h2 className="text-white font-bold mb-2">
          Daj {type === "yellow" ? "Żółtą" : "Czerwoną"} kartkę
        </h2>

        <textarea
          value={reason}
          maxLength={100}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Powód kartki..."
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <div className="text-xs text-gray-400 mt-1">{reason.length}/100</div>

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-3 py-1 text-sm text-gray-300">
            Anuluj
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            {loading ? "Dodawanie..." : "Dodaj"}
          </button>
        </div>
      </div>
    </div>
  );
};
