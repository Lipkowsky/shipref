import { Document, model, Schema, Types } from "mongoose";

export type CardType = "yellow" | "red";
export type CardStatus = "active" | "converted" | "trigger-red";

export interface ICardEvent extends Document {
  rivalryId: Types.ObjectId;
  giverUserId: Types.ObjectId;
  receiverUserId: Types.ObjectId;
  type: CardType;
  status: CardStatus;
  reason?: string;
  convertedIntoRedEventId?: Types.ObjectId | null;
}

const CardEventSchema = new Schema<ICardEvent>(
  {
    rivalryId: {
      type: Schema.Types.ObjectId,
      ref: "Rivalry",
      required: true,
    },

    giverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["yellow", "red"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "converted", "trigger-red"],
      default: "active",
    },

    convertedIntoRedEventId: {
      type: Schema.Types.ObjectId,
      ref: "CardEvent",
      default: null,
    },

    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

CardEventSchema.index({
  rivalryId: 1,
  receiverUserId: 1,
  type: 1,
  status: 1,
});

export const CardEvent = model<ICardEvent>("CardEvent", CardEventSchema);
