import User from '../models/User.js';

// ── @desc    Register a new user ─────────────────────────────────────────────
// ── @route   POST /api/users/register ────────────────────────────────────────
// ── @access  Public ──────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      return next(new Error('An account with this email already exists'));
    }

    // 2. Create the user — the pre('save') bcrypt hook fires automatically
    const user = await User.create({ name, email, password });

    // 3. Sign and return the JWT
    const token = user.getSignedJwtToken();
    res.status(201).json({ 
      success: true, 
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Login user and return JWT ───────────────────────────────────────
// ── @route   POST /api/users/login ───────────────────────────────────────────
// ── @access  Public ──────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate that both fields were provided
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide both email and password'));
    }

    // 2. Find user — must explicitly opt in to password (excluded by select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Use a generic message — never reveal which field is wrong
      res.status(401);
      return next(new Error('Invalid credentials'));
    }

    // 3. Compare the entered plain-text password with the stored bcrypt hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid credentials'));
    }

    // 4. Sign and return the JWT
    const token = user.getSignedJwtToken();
    res.status(200).json({ 
      success: true, 
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Get currently logged-in user's profile ──────────────────────────
// ── @route   GET /api/users/dashboard ────────────────────────────────────────
// ── @access  Private (requires valid JWT via protect middleware) ──────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is already populated and verified by the protect middleware
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Logout user ─────────────────────────────────────────────────────
// ── @route   POST /api/users/logout ──────────────────────────────────────────
// ── @access  Private ─────────────────────────────────────────────────────────
// NOTE: JWTs are stateless — the server cannot invalidate a token.
// Logout is handled on the CLIENT by discarding the token from storage.
// This endpoint provides a clean REST action for the frontend to call.
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export { register, login, getMe, logout };
