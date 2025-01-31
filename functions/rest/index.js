const {verifyToken} = require("./security/jwt-auth");
const validateMessage = require("./validation/validate-message");
const sendMessage = require("./publisher/send-message");
const {log} = require("firebase-functions/logger");

/**
 * Handles incoming HTTP requests to the REST endpoint.
 * Supports routing for the `/messages` path and manages message-sending logic.
 *
 * @async
 * @function rest
 * @param {Object} request - The incoming HTTP request object.
 * @param {Object} response - The HTTP response object.
 // * @param {Telegraf} bot - bot instance for interacting with Telegram API.
 * @return {Promise<void>} Resolves with a proper HTTP response.
 *
 * @throws {Error} - Returns appropriate HTTP status codes for:
 *   - 400 (Bad Request) for validation errors or missing parameters.
 *   - 401 (Unauthorized) if the JWT verification fails.
 *   - 405 (Method Not Allowed) for unsupported HTTP methods.
 *   - 500 (Internal Server Error) for unexpected issues during processing.
 */
async function rest(request, response) {
  if (request.path === "/messages") {
    try {
      verifyToken(request);
      if (request.method === "POST") {
        const message = request.body;
        log("Send message to chat:", JSON.stringify(message, null, 2));
        validateMessage(message);
        return await sendMessage(message, response);
      }
    } catch (error) {
      if (error.code === 400) {
        return response.status(error.code).send(error.message);
      }
      if (error.code === 401) {
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
}

module.exports = rest;

