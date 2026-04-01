/**
 * Role-based authorization middleware factory.
 * Usage: authorize('admin'), authorize('admin', 'resident')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized – authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied – role '${req.user.role}' is not permitted to perform this action`,
      });
    }

    next();
  };
};

module.exports = { authorize };
