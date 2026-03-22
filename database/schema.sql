-- ============================================================
--  RAILWAY SYSTEM DATABASE
--  Run this file in MySQL to set up everything
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS railway_db;
USE railway_db;

-- ============================================================
--  TABLE 1: TRAINS
--  Stores train name, route, timings
-- ============================================================
CREATE TABLE IF NOT EXISTS Trains (
  train_id       INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  source         VARCHAR(100) NOT NULL,
  destination    VARCHAR(100) NOT NULL,
  departure_time DATETIME     NOT NULL,
  arrival_time   DATETIME     NOT NULL
);

-- ============================================================
--  TABLE 2: PASSENGERS
--  Stores traveller details
-- ============================================================
CREATE TABLE IF NOT EXISTS Passengers (
  passenger_id INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) NOT NULL UNIQUE,
  phone        VARCHAR(15)
);

-- ============================================================
--  TABLE 3: TICKETS
--  Links a passenger to a train (many-to-many bridge table)
--  FK: passenger_id → Passengers
--  FK: train_id    → Trains
-- ============================================================
CREATE TABLE IF NOT EXISTS Tickets (
  ticket_id    INT AUTO_INCREMENT PRIMARY KEY,
  passenger_id INT          NOT NULL,
  train_id     INT          NOT NULL,
  booking_date DATE         NOT NULL,
  seat_number  VARCHAR(10)  NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'Booked',
  FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id),
  FOREIGN KEY (train_id)     REFERENCES Trains(train_id)
);

-- ============================================================
--  SAMPLE DATA — so your app isn't empty on first run
-- ============================================================
INSERT INTO Trains (name, source, destination, departure_time, arrival_time) VALUES
  ('Shatabdi Express', 'Delhi',  'Bhopal', '2025-06-01 06:00:00', '2025-06-01 12:00:00'),
  ('Duronto Express',  'Mumbai', 'Pune',   '2025-06-02 07:00:00', '2025-06-02 10:00:00');

INSERT INTO Passengers (name, email, phone) VALUES
  ('Aryan Sharma', 'aryan@mail.com', '9999911111'),
  ('Meera Patel',  'meera@mail.com', '8888822222');

INSERT INTO Tickets (passenger_id, train_id, booking_date, seat_number, status) VALUES
  (1, 1, '2025-05-25', 'A1', 'Booked'),
  (2, 2, '2025-05-26', 'B3', 'Booked');