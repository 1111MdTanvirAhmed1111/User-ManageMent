const User = require('../models/User');

const roleMiddleware = (requiredRole) => async (req, res, next) => {
  try {

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = roleMiddleware;