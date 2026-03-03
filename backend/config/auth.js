import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zen_readify_secret_key';

/**
 * Middleware to verify JWT tokens.
 * Expects header: Authorization: Bearer <token>
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Generate a JWT token (for login/signup endpoints).
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export { authenticate, generateToken, JWT_SECRET };
