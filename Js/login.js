// login.js

const { verifyPassword, generateToken } = require('./auth');
const db = require('./db');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.rows[0]);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
}

module.exports = { login };