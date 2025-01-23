const functions = require("firebase-functions");
const {Telegraf} = require("telegraf");
const {
  log,
  debug,
  error,
} = require("firebase-functions/logger");

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {webhookReply: true},
});

// error handling
bot.catch((err, ctx) => {
  error("[Bot] Error", err);
  return ctx.reply(`Oops, encountered an error for ${ctx.updateType}`, err);
});

// initialize the commands
bot.start((ctx) => ctx.reply("Hello! Send any message and I will copy it."));
bot.help((ctx) => ctx.reply("Send me a sticker"));

// copy every message and send to the user
bot.on("message", (ctx) => {
  debug("Message", ctx.message);
  return ctx.telegram.sendCopy(ctx.chat.id, ctx.message);
});

// handle all telegram updates with HTTPs trigger
exports.echoBot = functions.https.onRequest(async (request, response) => {
  log("Incoming message", request.body);
  return bot.handleUpdate(request.body, response)
      .then((rv) => {
        // rv represents the return value of the bot.handleUpdate() method.
        if (!rv) {
          // If rv is undefined (likely not a request from Telegram)
          // send a 200 response
          if (!response.headersSent) {
            response.sendStatus(200);
          }
        }
        return rv;
      })
      .catch((error) => {
        console.error("Error handling update:", error);
        if (!response.headersSent) {
          // Send a 500 response if an error occurs
          response.sendStatus(500);
        }
      });
});
