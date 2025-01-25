const {log} = require("firebase-functions/logger");
const bot = require("../../bot");

/**
 * Sends a message to a specified chat based on the message type.
 *
 * @async
 * @function sendMessage
 * @param {Object} message - The message object containing the parameters.
 * @param {string} message.chatId - The ID of the chat to send the message to.
 * @param {string} message.text - The text content of the message
 * (required for text messages).
 * @param {string} message.imageUrl - The URL of the image to send
 * (required for media messages).
 * @param {string} message.type - The type of message ("text" or "media").
 * @param {Object} response - The HTTP response object used to send
 * the response back.
 * @return {Promise<void>} Resolves with an HTTP status 200 response on success.
 *
 * @throws {Error} - Throws an error if message sending fails.
 */
async function sendMessage(message, response) {
  const {chatId, text, imageUrl, type} = message;

  // Send a message based on the `type` parameter
  await (type === "media" ?
         sendMediaMessage(bot, chatId, imageUrl, text) :
         sendTextMessage(bot, chatId, text));

  log(type === "media" ?
      "Media (image)" :
      "Text" + " message sent successfully to chat:", chatId);
  return response.sendStatus(200);
}

/**
 * Sends a media message (photo/image) with an optional caption.
 *
 * @param {Object} bot - The bot instance.
 * @param {string} chatId - The chat ID to send the message to.
 * @param {string} imageUrl - The URL of the image to send.
 * @param {string} caption - The optional caption for the image.
 * @return {Promise<void>} Resolves when the message is sent.
 */
async function sendMediaMessage(bot, chatId, imageUrl, caption) {
  await bot.telegram.sendPhoto(chatId, imageUrl, {caption, parse_mode: "HTML"});
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
  await bot.telegram.sendMessage(chatId, text, {parse_mode: "HTML"});
}

module.exports = sendMessage;
