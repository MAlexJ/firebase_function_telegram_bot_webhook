const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {log} = require("firebase-functions/logger");
const bot = require("./bot");
const verifyToken = require("./jwt");
const sendMessage = require("./sender");

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
  if (request.path === "/messages") {
    try {
      // Verify JWT for all incoming requests
      verifyToken(request);
      // Route POST requests to a dedicated handler
      if (request.method === "POST") {
        return await sendMessage(bot, request, response);
      }
    } catch (error) {
      if (error.code === 400) {
        return response.status(error.code).send(error.message);
      }
      if (error.code === 401 ) {
        return response.status(error.code).send(error.message);
      }
      // Firebase function error
      log("Error sending message:", error);
      return response.status(500).send("Failed to send message");
    }

    // Not supported HTTP methods
    return response.status(405).send("Http method not supported");
  }
  // GCP: Default STARTUP TCP probe succeeded
  // after attempt for container "worker" on port 8080
  log("Ping api!");
  return response.sendStatus(200);
});
