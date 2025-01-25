const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {log} = require("firebase-functions/logger");
const bot = require("./bot");
const rest = require("./rest");


// handle all telegram updates with HTTPs trigger
exports.echoBot = functions.https.onRequest(async (request, response) => {
  log("Incoming tg update:", request.body);
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
  return await rest(request, response);
});
