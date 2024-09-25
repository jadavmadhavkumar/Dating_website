-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL
);

-- Create hotels table
CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id)
);

-- Create bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  hotel_id INTEGER REFERENCES hotels(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL
);

-- Query to get all hotels with their owners
SELECT h.*, u.full_name AS owner_name
FROM hotels h
JOIN users u ON h.owner_id = u.id;

-- Query to get all bookings for a specific user
SELECT b.*, h.name AS hotel_name
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
WHERE b.user_id = $1;

-- Query to get all bookings for a specific hotel
SELECT b.*, u.full_name AS guest_name
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.hotel_id = $1;