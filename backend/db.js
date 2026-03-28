// ============================================================
//  db.js  —  MySQL Connection & Schema Initialization
//
//  This file creates ONE shared database connection that all
//  route files can import and use.
//  Think of it as the "phone line" between Node.js and MySQL.
//
//  On startup it also runs init.sql to create the Trains,
//  Passengers, and Tickets tables if they don't exist yet.
// ============================================================

const mysql = require('mysql2');
const fs    = require('fs');
const path  = require('path');

const pool = mysql.createPool({
  host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
  user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'railway_db',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  connectTimeout:     30000,
  acquireTimeout:     30000,
  ssl: process.env.MYSQLHOST && process.env.MYSQLHOST !== 'localhost'
    ? { rejectUnauthorized: false }
    : false
});

const db = pool.promise();

// ── SCHEMA INITIALIZATION ─────────────────────────────────────
// Read init.sql and execute each CREATE TABLE IF NOT EXISTS
// statement so the tables are ready before any request arrives.
async function initSchema() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connected successfully!');

    const sqlFile = path.join(__dirname, 'init.sql');
    const sql     = fs.readFileSync(sqlFile, 'utf8');

    // Split on semicolons, filter out blank lines and comments
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      await db.query(stmt);
    }

    console.log('✅ Database schema initialized (Trains, Passengers, Tickets)');
  } catch (err) {
    console.error('⚠️ Database initialization error:', err.message);
  }
}

initSchema();

module.exports = db;
