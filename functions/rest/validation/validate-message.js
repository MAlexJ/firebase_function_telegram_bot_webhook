/**
 * Validates the parameters of a message object.
 * Ensures all required fields are present based on the `type` of the message.
 *
 * @function validateMessage
 * @param {Object} message - The message object containing the parameters
 * to validate.
 * @param {string} message.chatId - The ID of the chat where the message
 * will be sent.
 * @param {string} [message.text] - The text content of the message
 * (required for `type: "text"`).
 * @param {string} [message.imageUrl] - The URL of the image
 * (required for `type: "media"`).
 * @param {string} message.type - The type of the message
 * (`text` or `media`).
 * @throws {Error} Throws a validation error with HTTP status code 400
 * if required fields are missing.
 */
function validateMessage(message) {
  const {chatId, text, imageUrl, type} = message;
  // Validate `chatId` (common for all types)
  if (!chatId) {
    throwValidationError("chatId is required");
  }

  // Validate based on `type`
  switch (type) {
    case "text":
      if (!text) {
        throwValidationError("text is required for type 'text'");
      }
      break;

    case "media":
      if (!imageUrl) {
        throwValidationError("imageUrl is required for type 'media'");
      }
      break;

    default:
      throwValidationError("type is required");
  }
}

/**
 * Throws a bad request error with a 400 HTTP status code
 *
 * @param {string} message - The error message to include in the exception
 * @throws {Error} An error object with an HTTP status code of 400
 */
function throwValidationError(message ) {
  const err = new Error(message);
  err.code = 400;
  throw err;
}

module.exports = validateMessage;
