import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Protect Middleware ────────────────────────────────────────────────────────
// Verifies the JWT sent in the Authorization header.
// On success: populates req.user and calls next().
// On failure: sets 401 status and passes an error to the central error handler.
const protect = async (req, res, next) => {
  let token;

  // Step 1 — Extract token from "Authorization: Bearer <token>" header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Step 2 — Reject if no token present
  if (!token) {
    res.status(401);
    return next(new Error('Not authorised, no token provided'));
  }

  try {
    // Step 3 — Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4 — Attach the user to the request (password excluded by select: false)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorised, user no longer exists'));
    }

    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorised, token invalid or expired'));
  }
};

export default protect;
