const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verifies the JWT in the Authorization header.
 * Attaches `req.user` (without password) on success.
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized – no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password) to request
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized – user not found or deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired – please log in again',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Not authorized – invalid token',
    });
  }
};

module.exports = { protect };
