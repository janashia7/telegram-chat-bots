import User from "./models.js";
import dotenv from "dotenv";
dotenv.config();

const findUsersDate = (date) => {
  const now = new Date(date);
  const minute = now.getUTCMinutes().toString().padStart(2, "0");
  const hour = now.getUTCHours().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;

  return User.find({ time });
};

export default findUsersDate;
