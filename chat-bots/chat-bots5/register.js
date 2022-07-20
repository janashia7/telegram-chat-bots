import User from "./models.js";

const register = async (chatId, location, time) => {
  await User.updateOne(
    {
      chatId,
    },
    {
      location,
      time,
    },
    { upsert: true }
  );
};

export default register;
