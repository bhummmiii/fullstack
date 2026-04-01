const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for the given user id.
 * Expires in the duration set by JWT_EXPIRES_IN env variable (default: 7d).
 *
 * @param {string} id - MongoDB user _id (as string)
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
