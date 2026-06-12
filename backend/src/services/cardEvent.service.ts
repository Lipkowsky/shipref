import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { Rivalry } from "../models/Rivalry";
import { CardEvent } from "../models/CardEvent";

export const giveYellowCard = async (
  rivalryId: string,
  giverId: string,
  reason: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(rivalryId)) {
    throw new AppError("Invalid rivalryId", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(giverId)) {
    throw new AppError("Invalid giverId", 400);
  }

  const rivalry = await Rivalry.findById(rivalryId);

  if (!rivalry || !rivalry.active) {
    throw new AppError("Rywalizacja nie istnieje lub jest nieaktywna", 404);
  }

  let receiverId: string;

  if (rivalry.playerA.toString() === giverId) {
    receiverId = rivalry.playerB.toString();
  } else if (rivalry.playerB.toString() === giverId) {
    receiverId = rivalry.playerA.toString();
  } else {
    throw new AppError("Nie należysz do tej rywalizacji", 403);
  }

  const yellow = await CardEvent.create({
    rivalryId,
    giverUserId: giverId,
    receiverUserId: receiverId,
    type: "yellow",
    status: "active",
    reason: reason,
  });

  const activeYellows = await CardEvent.find({
    rivalryId,
    receiverUserId: receiverId,
    type: "yellow",
    status: "active",
  });

  if (activeYellows.length >= 2) {
    const red = await CardEvent.create({
      rivalryId,
      giverUserId: giverId,
      receiverUserId: receiverId,
      type: "red",
      status: "active",
      reason: reason,
    });

    // 1. Znajdujemy poprzednie kartki (bez tej najnowszej)
    const previousYellowIds = activeYellows
      .map((card) => card._id)
      .filter((id) => id.toString() !== yellow._id.toString());

   
    await CardEvent.updateMany(
      { _id: { $in: previousYellowIds } },
      { status: "converted" },
    );


    yellow.status = "trigger-red";
    await yellow.save();

    return {
      yellow,
      red,
      autoRed: true,
    };
  }
  return {
    yellow,
    red: null, 
    autoRed: false,
  };
};

export const giveRedCard = async (
  rivalryId: string,
  giverId: string,
  reason: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(rivalryId)) {
    throw new AppError("Invalid rivalryId", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(giverId)) {
    throw new AppError("Invalid giverId", 400);
  }

  const rivalry = await Rivalry.findById(rivalryId);

  if (!rivalry || !rivalry.active) {
    throw new AppError("Rywalizacja nie istnieje lub jest nieaktywna", 404);
  }

  let receiverId: string;

  if (rivalry.playerA.toString() === giverId) {
    receiverId = rivalry.playerB.toString();
  } else if (rivalry.playerB.toString() === giverId) {
    receiverId = rivalry.playerA.toString();
  } else {
    throw new AppError("Nie należysz do tej rywalizacji", 403);
  }

  const red = await CardEvent.create({
    rivalryId,
    giverUserId: giverId,
    receiverUserId: receiverId,
    type: "red",
    status: "active",
    reason: reason,
  });

  return red;
};
