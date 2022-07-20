import axios from 'axios';
import { emojiCountryCode, countryCodeEmoji } from 'country-code-emoji';
import TelegramBot from 'node-telegram-bot-api';
import logger from './src/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const { TOKEN, API_KEY } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const getHoliday = async (country) => {
  try {
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    const month = dateNow.getMonth() + 1;
    const day = dateNow.getDate();
    const { data } = await axios.get(
      `https://holidays.abstractapi.com/v1/?api_key=${API_KEY}&country=${country}&year=${year}&month=${month}&day=${day}
      `
    );

    return (
      data.map(({ name }) => name).toString() ||
      `No Holidays today in ${countryCodeEmoji(country)}`
    );
  } catch (error) {
    logger.info('Something goes wrong');
  }
};

bot.on('message', (msg) => {
  const {
    chat: { id, first_name, last_name },
    text,
  } = msg;
  if (text === '/start') {
    bot.sendMessage(id, `${first_name} ${last_name} Choose Country ...`, {
      reply_markup: {
        keyboard: [
          [
            countryCodeEmoji('GE'),
            countryCodeEmoji('RU'),
            countryCodeEmoji('TR'),
            countryCodeEmoji('UA'),
            countryCodeEmoji('US'),
            countryCodeEmoji('CA'),
            countryCodeEmoji('GB'),
            countryCodeEmoji('AU'),
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } else if (text === 'GE' || text === 'RU' || text === 'TR' || text === 'UA' || text === 'US' || text === 'CA' || text === 'GB' || text === 'AU') {
    const country = emojiCountryCode(text);
    getHoliday(country).then((holidays) => bot.sendMessage(id, holidays));
  } else {
    bot.sendMessage(id, 'Please type /start to check holiday today');
  }
});
