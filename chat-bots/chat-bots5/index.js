import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import db from './connect.js';
import register from './register.js';
import time from './time.js';
import schedule from 'node-schedule';
import findUsersDate from './cron.js';
import getWeather from './weather.js';
import logger from './logger.js';

dotenv.config();

(async () =>
  await db()
    .then((response) => {
      const TOKEN = process.env.TOKEN;
      const regEx = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;

      const botKeyboard = {
        reply_markup: {
          keyboard: [
            [
              '/start',
              '/description',
              { text: 'Send Location', request_location: true },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };

      const bot = new TelegramBot(TOKEN, { polling: true });

      bot.on('message', (msg) => {
        const {
          chat: { id },
          text,
        } = msg;

        if (text === '/start') {
          bot.sendMessage(id, 'Please Send location', botKeyboard);
        } else if (text === '/description') {
          bot.sendMessage(
            id,
            'Hello I am weather bot and I can give you daily forecast on time',
            botKeyboard
          );
        } else if (typeof text === 'string' && !regEx.test(text)) {
          bot.sendMessage(id, 'Please use /start', botKeyboard);
        }
      });

      bot.on('location', async (msg) => {
        logger.info(msg);
        const {
          chat: { id },
          location,
        } = msg;
        bot.sendMessage(id, 'now input time');
        await register(id, location);
      });

      bot.onText(regEx, async (msg) => {
        logger.info(msg);
        const {
          chat: { id },
          text,
        } = msg;
        bot.sendMessage(id, 'Your time is saved please wait...');
        await time(id, text);
      });

      schedule.scheduleJob('* * * * *', async (date) => {
        const users = await findUsersDate(date);

        for (const user of users) {
          const weather = await getWeather(user.location);
          bot.sendMessage(
            user.chatId,
            `<b>Hello ${weather} celsius in your city</b>`,
            { parse_mode: 'HTML' }
          );
        }
      });
    })
    .catch((error) => {
      logger.error(error);
    }))();
