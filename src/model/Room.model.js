import mongoose from "mongoose";
import { playerSchema } from "./player.scheme.js";

const roomSchema = new mongoose.Schema({
  occupancy: {
    type: Number,
    default: 2,
  },
  maxRound: { type: Number, default: 6 },
  currentRounds: { type: Number, default: 1 },
  player: [playerSchema],
  isJoin: { type: Boolean, default: true },
  turn: playerSchema,
  turnIndex: { type: Number, default: 0 },
});

export const roomModel = mongoose.model("room", roomSchema);
