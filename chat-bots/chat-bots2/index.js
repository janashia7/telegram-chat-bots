import TelegramBot from 'node-telegram-bot-api';
import logger from './src/logger.js';
// import config from 'config';
import dotenv from 'dotenv';
dotenv.config();

// const TOKEN = config.get("token");
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });
bot.on('message', (msg) => {
  logger.info(msg);
  const {
    chat: { id, first_name, last_name },
    text,
  } = msg;
  if (text === '/about') {
    return bot.sendMessage(id, 'Hello, I am bot who makes pizza');
  }
  if (text === '/links') {
    return bot.sendMessage(
      id,
      'https://github.com/janashia7 , https://www.facebook.com/janashia7'
    );
  }
  if (text === '/start' || text === '/help') {
    return bot.sendMessage(
      id,
      `${first_name} ${last_name} for information click /about or /links`,
      {
        reply_markup: {
          keyboard: [['/about', '/links']],
        },
      }
    );
  }

  bot.sendMessage(id, 'Please for help write /help or /start');
});
