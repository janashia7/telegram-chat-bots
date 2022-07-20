import axios from "axios";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();
const API_KEY = process.env.API_KEY;

const getWeather = async (location) => {
  const { latitude, longitude } = location;
  logger.info(location);

  try {
    const {
      data: {
        main: { temp },
      },
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    return temp;
  } catch (error) {
    return 'Something went wrong!'
  }
};

export default getWeather;
