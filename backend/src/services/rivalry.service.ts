import { User } from "../models/User";
import { Rivalry } from "../models/Rivalry";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";


export const connectRivalry = async (playerAId: string, playerBId: string) => {
  if (!mongoose.Types.ObjectId.isValid(playerAId)) {
    throw new AppError("Invalid playerAId", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(playerBId)) {
    throw new AppError("Invalid playerBId", 400);
  }

  if (playerAId === playerBId) {
    throw new AppError("Nie możesz stworzyć rywalizacji ze sobą", 400);
  }

  const [playerA, playerB] = await Promise.all([
    User.findById(playerAId),
    User.findById(playerBId),
  ]);

  if (!playerA || !playerB) {
    throw new AppError("Użytkownik nie istnieje", 404);
  }

  const existingRivalry = await Rivalry.findOne({
    active: true,
    $or: [
      { playerA: playerAId, playerB: playerBId },
      { playerA: playerBId, playerB: playerAId },
    ],
  });

  if (existingRivalry) {
    throw new AppError("Rywalizacja już istnieje", 400);
  }

  const rivalry = await Rivalry.create({
    playerA: playerAId,
    playerB: playerBId,
    active: true,
  });

  return rivalry;
};

export const getRivalries = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid userId", 400);
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const rivalriesWithStats = await Rivalry.aggregate([
    // 1. Filtrujemy aktywne rywalizacje dla danego użytkownika
    {
      $match: {
        active: true,
        $or: [{ playerA: userObjectId }, { playerB: userObjectId }],
      },
    },

    // 2. NOWOŚĆ: Zaawansowany $lookup, który od razu sortuje i dołącza dane użytkowników do kart
    {
      $lookup: {
        from: "cardevents",
        let: { rivalryId: "$_id" },
        pipeline: [
          // Filtrujemy karty dopasowane do tej rywalizacji
          { $match: { $expr: { $eq: ["$rivalryId", "$$rivalryId"] } } },
          
          // Sortujemy od najnowszych
          { $sort: { createdAt: -1 } },
          // Wyciągamy dane dla giverUserId
          {
            $lookup: {
              from: "users",
              localField: "giverUserId",
              foreignField: "_id",
              as: "giver",
            },
          },
          { $unwind: { path: "$giver", preserveNullAndEmptyArrays: true } },
          // Wyciągamy dane dla receiverUserId
          {
            $lookup: {
              from: "users",
              localField: "receiverUserId",
              foreignField: "_id",
              as: "receiver",
            },
          },
          { $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true } },
        ],
        as: "cards",
      },
    },

    // 3. Populujemy dane Player A
    {
      $lookup: {
        from: "users",
        localField: "playerA",
        foreignField: "_id",
        as: "playerA",
      },
    },
    { $unwind: "$playerA" },

    // 4. Populujemy dane Player B
    {
      $lookup: {
        from: "users",
        localField: "playerB",
        foreignField: "_id",
        as: "playerB",
      },
    },
    { $unwind: "$playerB" },

    // 5. Mapujemy strukturę dokumentu i obliczamy statystyki
    {
      $project: {
        _id: 1,
        active: 1,
        createdAt: 1,
        updatedAt: 1,
        playerA: {
          _id: "$playerA._id",
          firstName: "$playerA.firstName",
          lastName: "$playerA.lastName",
          email: "$playerA.email",
          imageUrl: "$playerA.imageUrl",
        },
        playerB: {
          _id: "$playerB._id",
          firstName: "$playerB.firstName",
          lastName: "$playerB.lastName",
          email: "$playerB.email",
          imageUrl: "$playerB.imageUrl",
        },
        // Statystyki działają bez zmian, bo sprawdzają ID wewnątrz podpiętego wcześniej obiektu
        stats: {
          playerA: {
            yellow: {
              $size: {
                $filter: {
                  input: "$cards",
                  as: "card",
                  cond: {
                    $and: [
                      { $eq: ["$$card.receiver._id", "$playerA._id"] },
                      { $eq: ["$$card.type", "yellow"] },
                      { $eq: ["$$card.status", "active"] },
                    ],
                  },
                },
              },
            },
            red: {
              $size: {
                $filter: {
                  input: "$cards",
                  as: "card",
                  cond: {
                    $and: [
                      { $eq: ["$$card.receiver._id", "$playerA._id"] },
                      { $eq: ["$$card.type", "red"] },
                    ],
                  },
                },
              },
            },
          },
          playerB: {
            yellow: {
              $size: {
                $filter: {
                  input: "$cards",
                  as: "card",
                  cond: {
                    $and: [
                      { $eq: ["$$card.receiver._id", "$playerB._id"] },
                      { $eq: ["$$card.type", "yellow"] },
                      { $eq: ["$$card.status", "active"] },
                    ],
                  },
                },
              },
            },
            red: {
              $size: {
                $filter: {
                  input: "$cards",
                  as: "card",
                  cond: {
                    $and: [
                      { $eq: ["$$card.receiver._id", "$playerB._id"] },
                      { $eq: ["$$card.type", "red"] },
                    ],
                  },
                },
              },
            },
          },
        },
        // ZMIANA: Tablica cards jest już posortowana i ma obiekty, więc tylko mapujemy ładny kształt
        history: {
          $map: {
            input: "$cards",
            as: "card",
            in: {
              _id: "$$card._id",
              type: "$$card.type",
              status: "$$card.status",
              createdAt: "$$card.createdAt",
              giver: {
                _id: "$$card.giver._id",
                firstName: "$$card.giver.firstName",
                lastName: "$$card.giver.lastName",
              },
              receiver: {
                _id: "$$card.receiver._id",
                firstName: "$$card.receiver.firstName",
                lastName: "$$card.receiver.lastName",
              },
              reason: "$$card.reason",
            },
          },
        },
      },
    },
  ]);

  return rivalriesWithStats;
};
