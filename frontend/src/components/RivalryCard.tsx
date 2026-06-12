import { useState } from "react";
import type { RivalryPopulated } from "../types/types";
import { CardModal } from "./CardModal";

export const RivalryCard = ({
  r,
  refetch,
}: {
  r: RivalryPopulated;
  refetch: () => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [cardType, setCardType] = useState<"yellow" | "red">("yellow");

  const [visibleCount, setVisibleCount] = useState(5);
  const SLICE_COUNT = 5;
  const visibleHistory = r.history?.slice(0, visibleCount);

  const openModal = (type: "yellow" | "red") => {
    setCardType(type);
    setModalOpen(true);
  };

  return (
    <div className="w-full rounded-xl bg-gray-900 shadow-lg p-4 text-white border border-gray-700 max-w-full overflow-hidden">
      <div className="text-sm text-gray-400 mb-2">Rywale</div>

  
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
        {/* Gracz A */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <img
              src={r.playerA.imageUrl}
              alt={r.playerA.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-sm md:text-base">
              {r.playerA.firstName} {r.playerA.lastName}
            </span>
          </div>
          <div className="flex gap-1.5 ml-2">
            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-md text-xs font-bold">
              {r.stats.playerA.yellow}
            </span>
            <span className="bg-red-500 text-black px-2 py-0.5 rounded-md text-xs font-bold">
              {r.stats.playerA.red}
            </span>
          </div>
        </div>

        <span className="text-gray-500 text-xs md:text-sm my-1 md:my-0">VS</span>

        {/* Gracz B */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-row-reverse md:flex-row">
          <div className="flex items-center gap-2">
            <img
              src={r.playerB.imageUrl}
              alt={r.playerB.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-sm md:text-base">
              {r.playerB.firstName} {r.playerB.lastName}
            </span>
          </div>
          <div className="flex gap-1.5 mr-2 md:mr-0 md:ml-2">
            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-md text-xs font-bold">
              {r.stats.playerB.yellow}
            </span>
            <span className="bg-red-500 text-black px-2 py-0.5 rounded-md text-xs font-bold">
              {r.stats.playerB.red}
            </span>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 my-4">Historia</div>
      <div className="mt-3 space-y-3">
        {visibleHistory?.length ? (
          visibleHistory.map((card) => (
            <div
              key={card._id}
            
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 p-3 rounded-md gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
            
                <div className="w-14 shrink-0 h-[30px] flex items-center justify-start">
                  {card.type === "yellow" && (card.status === "active" || card.status === "converted") && (
                    <span className="w-[16px] h-[24px] bg-yellow-500 rounded-sm" />
                  )}

                  {card.type === "yellow" && card.status === "trigger-red" && (
                    <div className="flex items-center gap-1">
                      <span className="w-[16px] h-[24px] bg-yellow-500 rounded-sm" />
                      <span className="text-gray-500 text-xs">→</span>
                      <span className="w-[16px] h-[24px] bg-red-500 rounded-sm" />
                    </div>
                  )}

                  {card.type === "red" && (
                    <span className="w-[16px] h-[24px] bg-red-500 rounded-sm" />
                  )}
                </div>

             
                <div className="flex flex-wrap items-center gap-1 text-xs text-gray-300">
                  <span className="font-medium text-white">{card.giver.firstName}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-medium text-white">{card.receiver.firstName}</span>

                  {card.reason && (
                    <span className="text-gray-400 italic break-all">
                      ({card.reason})
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-gray-500 self-end sm:self-auto shrink-0">
                {new Date(card.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">Brak historii</div>
        )}

        {r.history && r.history.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((prev) => prev + SLICE_COUNT)}
            className="text-xs text-blue-400 hover:text-blue-300 pt-1 block"
          >
            Pokaż więcej
          </button>
        )}
        {r.history && r.history.length > visibleCount && visibleCount > SLICE_COUNT && (
          <button
            onClick={() => setVisibleCount((prev) => prev - SLICE_COUNT)}
            className="text-xs text-blue-400 hover:text-blue-300 pt-1 block"
          >
            Pokaż mniej
          </button>
        )}
      </div>

      <div className="flex justify-center text-sm gap-4 mt-5">
        <button
          onClick={() => openModal("yellow")}
          className="text-center cursor-pointer px-5 bg-yellow-500 text-black py-2 rounded-md font-bold hover:bg-yellow-400 transition-colors"
        >
          Żółta Kartka
        </button>

        <button
          onClick={() => openModal("red")}
          className="text-center cursor-pointer px-5 bg-red-500 text-black py-2 rounded-md font-bold hover:bg-red-400 transition-colors"
        >
          Czerwona Kartka
        </button>
      </div>

      <CardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rivalryId={r._id}
        type={cardType}
        onSuccess={refetch}
      />
    </div>
  );
};

export default RivalryCard;