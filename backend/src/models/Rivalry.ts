import { Document, model, Schema, Types } from "mongoose";

export interface IRivalry extends Document {
  playerA: Types.ObjectId;
  playerB: Types.ObjectId;
  active: boolean;
}

const RivalrySchema = new Schema<IRivalry>(
  {
    playerA: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    playerB: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Rivalry = model<IRivalry>(
  "Rivalry",
  RivalrySchema
);