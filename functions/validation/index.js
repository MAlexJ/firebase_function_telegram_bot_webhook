/**
 * Validates the request body for required parameters.
 * Ensures the payload contains the appropriate fields based on the `type`.
 *
 * @param {String} chatId - chat or user id
 * @param {String} text - message
 * @param {String} imageUrl - Timage url
 * @param {String} type - media or text type
 * @throws {Error} Throws an error with HTTP status code 400
 * if a required parameter is missing or if the payload is invalid.
 */
function validateMessage(chatId, text, imageUrl, type) {
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
