import mongoose from "mongoose";

const GameLobbySchema = new mongoose.Schema({
    lobbyType: {
        type: String,
        enum: ["darkboard", "online"],
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
    createdAt: { type: Date, default: Date.now },
    lookingForPlayer: { type: Boolean, default: false },
});

export default mongoose.models.GameLobby ||
    mongoose.model("GameLobby", GameLobbySchema);
