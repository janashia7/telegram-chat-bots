import mongoose from "mongoose";
const User = mongoose.model("User", {
  chatId: Number,
  time: String,
  location: Object,
});

export default User;
