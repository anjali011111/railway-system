// ============================================================
//  db.js  —  MySQL Connection
//
//  This file creates ONE shared database connection that all
//  route files can import and use.
//  Think of it as the "phone line" between Node.js and MySQL.
// ============================================================

const mysql = require('mysql2');

// When running on Railway, it provides database credentials
// as environment variables automatically.
// When running locally, it falls back to your local MySQL settings.
const pool = mysql.createPool({
  host:     process.env.MYSQLHOST     || 'localhost',
  user:     process.env.MYSQLUSER     || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'railway_db',
  port:     process.env.MYSQLPORT     || 3306,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

const db = pool.promise();
module.exports = db;