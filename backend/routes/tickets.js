// ============================================================
//  routes/tickets.js  —  All API endpoints for TICKETS
//
//  GET  /api/tickets            → fetch all tickets (with joins)
//  POST /api/tickets            → book a ticket
//  PUT  /api/tickets/:id/cancel → cancel a ticket
//  GET  /api/tickets/stats      → dashboard counts
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET DASHBOARD STATS ───────────────────────────────────────
// Must be defined BEFORE /:id routes to avoid conflict
router.get('/stats', async (req, res) => {
  try {
    const [[trains]]     = await db.query('SELECT COUNT(*) AS cnt FROM Trains');
    const [[passengers]] = await db.query('SELECT COUNT(*) AS cnt FROM Passengers');
    const [[booked]]     = await db.query("SELECT COUNT(*) AS cnt FROM Tickets WHERE status='Booked'");
    const [[cancelled]]  = await db.query("SELECT COUNT(*) AS cnt FROM Tickets WHERE status='Cancelled'");
    res.json({
      trains:     trains.cnt,
      passengers: passengers.cnt,
      booked:     booked.cnt,
      cancelled:  cancelled.cnt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ALL TICKETS ───────────────────────────────────────────
// Uses JOIN to bring in passenger name and train name
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.ticket_id, t.seat_number, t.booking_date, t.status,
        p.passenger_id, p.name AS passenger_name, p.email,
        tr.train_id, tr.name AS train_name,
        tr.source, tr.destination,
        tr.departure_time, tr.arrival_time
      FROM  Tickets    t
      JOIN  Passengers p  ON t.passenger_id = p.passenger_id
      JOIN  Trains     tr ON t.train_id     = tr.train_id
      ORDER BY t.ticket_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BOOK A TICKET ────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { passenger_id, train_id, booking_date, seat_number } = req.body;

  if (!passenger_id || !train_id || !booking_date || !seat_number) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if seat is already taken on this train
    const [existing] = await db.query(
      "SELECT ticket_id FROM Tickets WHERE train_id=? AND seat_number=? AND status='Booked'",
      [train_id, seat_number.toUpperCase()]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: `Seat ${seat_number} is already taken!` });
    }

    const [result] = await db.query(
      'INSERT INTO Tickets (passenger_id, train_id, booking_date, seat_number, status) VALUES (?,?,?,?,?)',
      [passenger_id, train_id, booking_date, seat_number.toUpperCase(), 'Booked']
    );
    res.json({ message: 'Ticket booked', ticket_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CANCEL A TICKET ──────────────────────────────────────────
router.put('/:id/cancel', async (req, res) => {
  const ticketId = req.params.id;
  try {
    await db.query(
      "UPDATE Tickets SET status='Cancelled' WHERE ticket_id=?",
      [ticketId]
    );
    res.json({ message: 'Ticket cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;