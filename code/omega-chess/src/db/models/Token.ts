const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, default: () => {
        const date = new Date()
        date.setMonth(date.getMonth() + 1)
        return date
    } },
})

export default mongoose.models.Token || mongoose.model("Token", tokenSchema)