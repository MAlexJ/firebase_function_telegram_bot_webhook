const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");

const {
  debug, error,
} = require("firebase-functions/logger");

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {webhookReply: true},
});

// Commands
bot.start((ctx) => ctx.reply("Hello! Send any message and I will copy it."));
bot.help((ctx) => ctx.reply("Send me a sticker"));

// Message handler
bot.on(message(), (ctx) => {
  debug("Message handler: ", ctx.message);
  return ctx.copyMessage(ctx.chat.id);
});

// Error handling
bot.catch(async (err, ctx) => {
  error("[Bot] Error:", err);

  try {
    const errMsg = `Oops, encountered an error for ${ctx.updateType}`;
    await ctx.reply(errMsg);
  } catch (replyError) {
    error("[Bot] Failed to send error message:", replyError);
  }
});

module.exports = bot;
