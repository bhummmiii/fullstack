/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes in server.js (4 parameters).
 */
const errorHandler = (err, req, res, next) => {   // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Mongoose – bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // Mongoose – duplicate key (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value: '${err.keyValue?.[field]}' is already registered for ${field}`;
  }

  // Mongoose – validation errors
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // JWT errors (fallback – normally handled in authMiddleware)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer file-size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large – maximum size is 5MB';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler for unmatched routes.
 * Register before errorHandler in server.js.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
