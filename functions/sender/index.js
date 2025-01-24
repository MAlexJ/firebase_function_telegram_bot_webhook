const {log} = require("firebase-functions/logger");
const validateMessage = require("../validation");

/**
 * Send media or text message to chatId
 *
 * @param {Object} bot - Telegram bot
 * @param {Object} request - The incoming HTTP request object
 * @param {Object} response - The HTTP response object
 * @return {Promise<void>} Resolves when the response is sent
 */
async function sendMessage(bot, request, response) {
  const jsonBody = request.body;

  log("Send message request:", JSON.stringify(jsonBody, null, 2));

  // extract parameters
  const {chatId, text, imageUrl, type} = request.body;

  // Validates the presence required parameters in the request body
  validateMessage(chatId, text, imageUrl, type);

  // Send a message based on the type
  await (type === "media" ?
      sendMediaMessage(bot, chatId, imageUrl, text) :
      sendTextMessage(bot, chatId, text));

  return response.sendStatus(200);
}


/**
 * Sends a media message (photo) with an optional caption.
 *
 * @param {Object} bot - The bot instance.
 * @param {string} chatId - The chat ID to send the message to.
 * @param {string} imageUrl - The URL of the image to send.
 * @param {string} caption - The optional caption for the image.
 * @return {Promise<void>} Resolves when the message is sent.
 */
async function sendMediaMessage(bot, chatId, imageUrl, caption) {
  await bot.telegram.sendPhoto(chatId, imageUrl, {
    caption,
    parse_mode: "HTML", // Enable HTML formatting in the caption
  });
  log("Media message (photo) sent successfully to chat:", chatId);
}

/**
 * Sends a plain text message with optional HTML formatting.
 *
 * @param {Object} bot - The bot instance.
 * @param {string} chatId - The chat ID to send the message to.
 * @param {string} text - The text of the message to send.
 * @return {Promise<void>} Resolves when the message is sent.
 */
async function sendTextMessage(bot, chatId, text) {
  await bot.telegram.sendMessage(chatId, text, {
    parse_mode: "HTML", // Enable HTML formatting
  });
  log("Text message sent successfully to chat:", chatId);
}

module.exports = sendMessage;
