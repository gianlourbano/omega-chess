import mongoose from "mongoose"

const DeveloperCustomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    scores: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.DeveloperCustom || mongoose.model("DeveloperCustom", DeveloperCustomSchema)