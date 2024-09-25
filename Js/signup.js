// signup.js

const { hashPassword, generateToken, ROLES } = require('./auth');
const db = require('./db'); // Assume you have a database connection module

async function signup(req, res) {
  const { fullName, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullName, email, hashedPassword, role || ROLES.USER]
    );

    // Generate token
    const token = generateToken(newUser.rows[0]);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
}

module.exports = { signup };