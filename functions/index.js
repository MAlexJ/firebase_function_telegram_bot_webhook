const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {Telegraf} = require("telegraf");
const {
  log,
  debug,
  error,
} = require("firebase-functions/logger");
const handlePostRequest = require("./handlers/postHandler");
const verifyJWT = require("./middleware/verifyJWT");

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {webhookReply: true},
});

// error handling
bot.catch(async (err, ctx) => {
  // Log the error for debugging
  error("[Bot] Error:", err);

  try {
    // Send a user-friendly error message to the user
    const errMsg = `Oops, encountered an error for ${ctx.updateType}`;
    await ctx.reply(errMsg);
  } catch (replyError) {
    console.error("[Bot] Failed to send error message:", replyError);
  }
});

// initialize the commands
bot.start((ctx) => ctx.reply("Hello! Send any message and I will copy it."));
bot.help((ctx) => ctx.reply("Send me a sticker"));

// copy every message and send to the user
bot.on("message", (ctx) => {
  debug("Message", ctx.message);
  return ctx.copyMessage(ctx.chat.id);
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

exports.api = onRequest(async (request, response) => {
  // HTTP routing
  if (request.path === "/messages") {
    try {
      // Verify JWT for all incoming requests
      verifyJWT(request);
      // Route POST requests to a dedicated handler
      if (request.method === "POST") {
        return await handlePostRequest(bot, request, response);
      }
    } catch (error) {
      if (error.code === 400) {
        return response.status(error.code )
            .send(error.description);
      }
      if (error.code === 401 || error.httpStatusCode === 401 ) {
        response.status(error.code )
            .send(error.description || error.message);
      }
      // Firebase function error
      log("Error sending message:", error);
      return response.status(500)
          .send("Failed to send message");
    }

    // Not supported HTTP methods
    return response.status(405)
        .send("Method Not Allowed");
  }

  // GCP: Default STARTUP TCP probe succeeded
  // after attempt for container "worker" on port 8080
  log("Ping api!");
  response.sendStatus(200);
});
