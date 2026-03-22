// ============================================================
//  db.js  —  MySQL Connection
//
//  This file creates ONE shared database connection that all
//  route files can import and use.
//  Think of it as the "phone line" between Node.js and MySQL.
// ============================================================

const mysql = require('mysql2');

// createPool keeps a set of connections ready (better than
// creating a new connection on every request)
const pool = mysql.createPool({
  host:     'localhost',   // Where MySQL is running (your own PC)
  user:     'root',        // MySQL username (default: root)
  password: '',            // ← PUT YOUR MySQL PASSWORD HERE
  database: 'railway_db', // The database name from schema.sql
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

// .promise() lets us use async/await instead of callbacks
const db = pool.promise();

module.exports = db;