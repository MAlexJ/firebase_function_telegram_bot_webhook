const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

/**
 * Middleware to verify a JSON Web Token (JWT) from the Authorization header.
 *
 * @param {Object} request - The incoming HTTP request object.
 * @param {Object} request.headers - The headers of the HTTP request.
 * @param {string} request.headers.authorization - The Authorization header
 * containing the JWT.
 * @return {Object} Decoded JWT payload if the token is valid.
 * @throws {Error} If the Authorization header or token is missing,
 * or the token is invalid.
 */
function verifyJWT(request) {
  const authHeader = request.headers.authorization;

  // Expecting Authorization header in http request
  if (!authHeader) {
    throwAuthorizationError("Authorization header is missing");
  }

  // Expecting "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    throwAuthorizationError("Token is missing");
  }

  try {
    // Return the decoded payload if valid
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throwAuthorizationError("Invalid or expired token");
  }
}

/**
 * Throws an authorization error with a 401 HTTP status code.
 *
 * @param {string} message - The error message to include in the exception.
 * @throws {Error} An error object with an HTTP status code of 401.
 */
function throwAuthorizationError(message ) {
  const err = new Error(message);
  err.httpStatusCode = 401;
  throw err;
}

module.exports = verifyJWT;
