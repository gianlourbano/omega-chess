const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  scores: {
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
  },
  registeredAt: { type: Date, default: Date.now },
  games: { type: Array, default: [] },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)

