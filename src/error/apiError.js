/**
 * Represents an API error that can be handled.
 * @param {string} message - corresponding error message.
 * @param {number} statusCode - corresponding http status code.
 */
class APIError extends Error {
  constructor(message, statusCode, customData = {}) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.customData = customData;
  }
}

/** Generates a custom api error with given message and status code. */
const generateAPIError = (msg, statusCode, customData = {}) => {
  throw new APIError(msg, statusCode, customData);
};

export { generateAPIError, APIError };
