import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    gamemode: {
        type: String,
        enum: ["kriegspiel"],
        required: true,
    },
    whitePlayer: {
        type: String,
        required: true,
    },
    blackPlayer: {
        type: String,
        required: false,
    },
    pgn: String,
    result: String,
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Game || mongoose.model("Game", GameSchema)