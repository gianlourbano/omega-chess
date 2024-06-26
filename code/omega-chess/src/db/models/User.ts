import { DEFAULT_RATING } from "@/utils/ELO/Constants";

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    scores: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
    },
    registeredAt: { type: Date, default: Date.now },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    developer: {
        token: { type: mongoose.Schema.Types.ObjectId, ref: "Token" },
        customs: [{ type: mongoose.Schema.Types.ObjectId, ref: "DeveloperCustom", default: [] }],
    },
    role: { type: String, enum: ["user", "developer"], default: "user" },
    eloScore: { type: Number, default: DEFAULT_RATING}
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
