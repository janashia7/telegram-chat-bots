import User from "./models.js";
import timeConvert from "./timezone.js";

const time = async (chatId, time) => {
  // const availableUser = await User.findOne({ chatId: chatId });
  // const { latitude, longitude } = availableUser.location;
  // if (availableUser) {
  //   availableUser.time = timeConvert(time, latitude, longitude);
  //   return await availableUser.save();
  // }
  const availableUser = await User.findOne({ chatId: chatId });
  const { latitude, longitude } = availableUser.location;

  await User.updateOne(
    { chatId },
    { time: timeConvert(time, latitude, longitude) }
  );
};

export default time;
