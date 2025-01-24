const {log, error} = require("firebase-functions/logger");

/**
 * Handles POST requests to the `/messages` endpoint.
 *
 * @param {Object} bot - Telegram bot
 * @param {Object} request - The incoming HTTP request object.
 * @param {Object} response - The HTTP response object.
 * @return {Promise<void>} Resolves when the response is sent.
 */
async function handlePostRequest(bot, request, response) {
  // Incoming HTTP request
  log("HTTP POST:", JSON.stringify(request.body, null, 2));

  const {chatId, text, imageUrl, type} = request.body;

  // Validate input parameters
  if (!chatId) {
    return response.status(400).send("chatId is required.");
  }

  try {
    if (type === "media") {
      if (!imageUrl) {
        return response.status(400)
            .send("imageUrl is required for media type.");
      }

      await bot.telegram.sendPhoto(chatId, imageUrl, {
        caption: text,
        // Enable HTML formatting
        parse_mode: "HTML",
      });
      log("Media message (photo) sent successfully to chat:", chatId);
    } else {
      if (!text) {
        return response.status(400).send("text is required.");
      }

      await bot.telegram.sendMessage(chatId, text, {
        // Enable HTML formatting
        parse_mode: "HTML",
      });
      log("Text message sent successfully to chat:", chatId);
    }

    return response.sendStatus(200);
  } catch (err) {
    error("Error sending message:", err);
    return response.status(500).send("Failed to send message");
  }
}

module.exports = handlePostRequest;
