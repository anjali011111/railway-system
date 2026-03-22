// ============================================================
//  routes/trains.js  —  All API endpoints for TRAINS
//
//  GET    /api/trains        → fetch all trains
//  POST   /api/trains        → add a new train
//  DELETE /api/trains/:id    → delete a train by ID
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET ALL TRAINS ──────────────────────────────────────────
// When frontend calls: fetch('/api/trains')
// This queries the Trains table and sends back JSON array
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Trains ORDER BY train_id');
    res.json(rows);          // sends: [{train_id:1, name:"Shatabdi",...}, ...]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADD A TRAIN ──────────────────────────────────────────────
// When frontend calls: fetch('/api/trains', { method:'POST', body: {...} })
router.post('/', async (req, res) => {
  const { name, source, destination, departure_time, arrival_time } = req.body;

  // Basic validation — don't insert if fields are empty
  if (!name || !source || !destination || !departure_time || !arrival_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Trains (name, source, destination, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?)',
      [name, source, destination, departure_time, arrival_time]
      // The ? marks are placeholders — mysql2 fills them safely (prevents SQL injection)
    );
    res.json({ message: 'Train added', train_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE A TRAIN ───────────────────────────────────────────
// When frontend calls: fetch('/api/trains/2', { method:'DELETE' })
router.delete('/:id', async (req, res) => {
  const trainId = req.params.id;   // grabs the :id from the URL

  try {
    // Safety check: don't delete if train has active booked tickets
    const [activeTickets] = await db.query(
      "SELECT COUNT(*) AS cnt FROM Tickets WHERE train_id = ? AND status = 'Booked'",
      [trainId]
    );
    if (activeTickets[0].cnt > 0) {
      return res.status(400).json({ error: 'Cannot delete — train has active bookings' });
    }

    await db.query('DELETE FROM Trains WHERE train_id = ?', [trainId]);
    res.json({ message: 'Train deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;