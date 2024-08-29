import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  socketId: { type: String },
  ponits: { type: Number, default: 0 },
  playerType: { type: String },
});

export { playerSchema };
