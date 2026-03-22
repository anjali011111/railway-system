// ============================================================
//  routes/passengers.js  —  All API endpoints for PASSENGERS
//
//  GET    /api/passengers      → fetch all passengers
//  POST   /api/passengers      → register a new passenger
//  DELETE /api/passengers/:id  → remove a passenger
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET ALL PASSENGERS ────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // Also count how many booked tickets each passenger has (using LEFT JOIN)
    const [rows] = await db.query(`
      SELECT p.*,
             COUNT(CASE WHEN t.status = 'Booked' THEN 1 END) AS active_tickets
      FROM   Passengers p
      LEFT JOIN Tickets t ON p.passenger_id = t.passenger_id
      GROUP BY p.passenger_id
      ORDER BY p.passenger_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADD A PASSENGER ──────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Passengers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone || null]
    );
    res.json({ message: 'Passenger registered', passenger_id: result.insertId });
  } catch (err) {
    // Error code 1062 = duplicate email (UNIQUE constraint)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE A PASSENGER ────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const passId = req.params.id;

  try {
    // Safety check: don't delete passenger with active tickets
    const [active] = await db.query(
      "SELECT COUNT(*) AS cnt FROM Tickets WHERE passenger_id = ? AND status = 'Booked'",
      [passId]
    );
    if (active[0].cnt > 0) {
      return res.status(400).json({ error: 'Cannot delete — passenger has active tickets' });
    }

    await db.query('DELETE FROM Passengers WHERE passenger_id = ?', [passId]);
    res.json({ message: 'Passenger removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;