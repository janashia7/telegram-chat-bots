const TelegramBot = require("node-telegram-bot-api");
const config = require("config");

const TOKEN = config.get("token");
console.log(TOKEN);
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  const {
    chat: { id },
    text,
  } = msg;
  if (text == "/about") {
    bot.sendMessage(id, "Hello, I am bot who makes pizza");
  } else if (text == "/links") {
    bot.sendMessage(
      id,
      "https://github.com/janashia7 , https://www.facebook.com/janashia7"
    );
  } else if (text == "/start" || text == "/help") {
    bot.sendMessage(id, `${id.username} for information type /about or /links`, {
      reply_markup: {
        keyboard: [["/about", "/links"]],
      },
    });
  }else{
      bot.sendMessage(id, 'Please for help write /help or /start')
  }
});
