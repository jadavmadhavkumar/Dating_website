// auth.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// User roles
const ROLES = {
  USER: 'user',
  HOTEL_OWNER: 'hotel_owner',
  ADMIN: 'admin'
};

// Function to hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Function to verify password
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

// Middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = {
  ROLES,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  checkRole
};