-- ============================================================
--  init.sql  —  Database Schema Initialization
--
--  These statements are executed automatically on server
--  startup (via db.js). Using IF NOT EXISTS ensures they are
--  safe to run repeatedly without destroying existing data.
-- ============================================================

CREATE TABLE IF NOT EXISTS Trains (
  train_id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  source         VARCHAR(100) NOT NULL,
  destination    VARCHAR(100) NOT NULL,
  departure_time DATETIME     NOT NULL,
  arrival_time   DATETIME     NOT NULL
);

CREATE TABLE IF NOT EXISTS Passengers (
  passenger_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE NOT NULL,
  phone        VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS Tickets (
  ticket_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  passenger_id INT UNSIGNED NOT NULL,
  train_id     INT UNSIGNED NOT NULL,
  booking_date DATE        NOT NULL,
  seat_number  VARCHAR(10) NOT NULL,
  status       VARCHAR(20) DEFAULT 'Booked',
  FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id),
  FOREIGN KEY (train_id)     REFERENCES Trains(train_id)
);
