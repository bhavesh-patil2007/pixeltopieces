import mongoose, { Schema } from "mongoose";

const AuthRateLimitSchema = new Schema(
  {
    _id: { type: String, required: true },
    attempts: { type: Number, default: 0, min: 0 },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { versionKey: false },
);

export default mongoose.models.AuthRateLimit ||
  mongoose.model("AuthRateLimit", AuthRateLimitSchema, "auth_rate_limits");
