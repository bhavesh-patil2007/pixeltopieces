import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

UserSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.passwordHash;
    delete returnedObject.__v;
    return returnedObject;
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
