// hotelManagement.js

const db = require('./db');
const { verifyToken, checkRole, ROLES } = require('./auth');

// Add a new hotel (for hotel owners)
async function addHotel(req, res) {
  verifyToken(req, res, async () => {
    checkRole(ROLES.HOTEL_OWNER)(req, res, async () => {
      const { name, address, description } = req.body;
      try {
        const newHotel = await db.query(
          'INSERT INTO hotels (name, address, description, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, address, description, req.userId]
        );
        res.status(201).json(newHotel.rows[0]);
      } catch (error) {
        res.status(500).json({ message: 'Error adding hotel' });
      }
    });
  });
}

// Get all hotels (for users)
async function getAllHotels(req, res) {
  verifyToken(req, res, async () => {
    try {
      const hotels = await db.query('SELECT * FROM hotels');
      res.json(hotels.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching hotels' });
    }
  });
}

// Book a hotel (for users)
async function bookHotel(req, res) {
  verifyToken(req, res, async () => {
    const { hotelId, checkInDate, checkOutDate } = req.body;
    try {
      const booking = await db.query(
        'INSERT INTO bookings (user_id, hotel_id, check_in_date, check_out_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.userId, hotelId, checkInDate, checkOutDate]
      );
      res.status(201).json(booking.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error booking hotel' });
    }
  });
}

module.exports = { addHotel, getAllHotels, bookHotel };