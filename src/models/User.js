import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, require: true, unique: true },
  password: { type: String },
  name: { type: String, require: true },
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcryptjs.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
