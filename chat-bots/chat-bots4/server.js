import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import logger from './src/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const { TOKEN, API_KEY } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const getWeather = async (lat, lon) => {
  const {
    data: {
      main: { temp },
    },
  } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  return temp;
};

bot.on('message', async (msg) => {
  try {
    const {
      chat: { id, first_name, last_name },
      text,
    } = msg;
    if (text === '/start' || text === '/help') {
      return bot.sendMessage(
        id,
        `Hello ${first_name} ${last_name}, Send me a location to see the weather forecast in your city`,
        {
          reply_markup: {
            keyboard: [[{ text: 'Send location', request_location: true }]],
          },
        }
      );
    } else if (typeof text === 'string') {
      return bot.sendMessage(
        id,
        `Hello ${first_name} ${last_name} please click /start or /help`,
        { reply_markup: { keyboard: [['/start', '/help']] } }
      );
    }
  } catch (error) {
    logger.info(error);
  }
});

bot.on('location', async (msg) => {
  logger.info(msg);
  try {
    const {
      chat: { id, first_name, last_name },
      location: { latitude, longitude },
    } = msg;
    logger.info(msg);
    const temp = await getWeather(`${latitude}`, `${longitude}`);

    bot.sendMessage(
      id,
      `<b>Hello ${first_name} ${last_name} ${temp} Celsius in your city</b>`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    logger.info(error);
  }
});
