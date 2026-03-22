// ============================================================
//  db.js  —  MySQL Connection
//
//  This file creates ONE shared database connection that all
//  route files can import and use.
//  Think of it as the "phone line" between Node.js and MySQL.
// ============================================================

const mysql = require('mysql2');

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

// Test connection on startup
db.query('SELECT 1')
  .then(() => console.log('✅ Database connected successfully!'))
  .catch(err => console.error('⚠️ Database connection error:', err.message));

module.exports = db;