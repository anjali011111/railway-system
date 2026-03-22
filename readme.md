# 🚂 Railway System — Full Stack Project Guide
## For DBMS Students | Frontend + Backend + Database

---

## 🗂 PROJECT STRUCTURE (Where Every File Lives)

```
railway-system/
│
├── 📁 frontend/
│   └── index.html          ← Your UI (what users SEE in browser)
│
├── 📁 backend/
│   ├── server.js           ← Main backend file (starts the server)
│   ├── db.js               ← MySQL connection setup
│   ├── package.json        ← Lists all Node.js packages needed
│   └── 📁 routes/
│       ├── trains.js       ← All train API endpoints
│       ├── passengers.js   ← All passenger API endpoints
│       └── tickets.js      ← All ticket API endpoints
│
└── 📁 database/
    └── schema.sql          ← SQL file to create tables + sample data
```

---

## 🧠 WHAT EACH LAYER DOES (The Big Picture)

```
[Browser / index.html]
        ↕  fetch() HTTP calls
[Node.js + Express Backend / server.js]
        ↕  SQL queries
[MySQL Database / railway_db]
```

| Layer      | Technology | Job |
|------------|------------|-----|
| Frontend   | HTML + CSS + JavaScript | Shows data to user, sends user input |
| Backend    | Node.js + Express       | Receives requests, runs SQL, sends response |
| Database   | MySQL                   | Stores all data permanently |

---

## 🛠 STEP 1 — TOOLS TO INSTALL

### 1A. Install Node.js
- Go to: https://nodejs.org
- Download the **LTS version** (e.g. v20)
- Install it (click Next → Next → Finish)
- **Test it:** Open Command Prompt and type:
  ```
  node --version
  ```
  You should see something like `v20.11.0`

**What is Node.js?**
Node.js lets you run JavaScript on your computer (not just in the browser).
Your `server.js` file runs using Node.js.

---

### 1B. Install MySQL
- Go to: https://dev.mysql.com/downloads/installer/
- Download **MySQL Installer** (Windows) or use **XAMPP** (easier for beginners)
- During setup, set a root password — **remember it!**
- Also install **MySQL Workbench** (comes with the installer) — it's a visual tool to see your tables

**What is MySQL?**
MySQL is a database system. It stores data in tables (like Excel sheets) permanently on your computer's hard drive.

---

## 📁 STEP 2 — SET UP THE DATABASE

1. Open **MySQL Workbench** and connect to your MySQL server
2. Click **File → Open SQL Script**
3. Open the file: `database/schema.sql`
4. Press **Ctrl + Shift + Enter** to run it (or click the lightning bolt ⚡ button)
5. You should see:
   - Database `railway_db` created
   - Tables: `Trains`, `Passengers`, `Tickets` created
   - 2 sample trains, 2 passengers, 2 tickets inserted

**Verify it worked:** In Workbench, run:
```sql
USE railway_db;
SELECT * FROM Trains;
```
You should see Shatabdi Express and Duronto Express.

---

## ⚙️ STEP 3 — SET UP THE BACKEND

### 3A. Set Your MySQL Password

Open `backend/db.js` and find this line:
```javascript
password: '',   // ← PUT YOUR MySQL PASSWORD HERE
```
Change it to your MySQL root password. Example:
```javascript
password: 'mypassword123',
```

---

### 3B. Install Node.js Packages

Open **Command Prompt** (or VS Code Terminal):
```bash
cd railway-system/backend
npm install
```

This reads `package.json` and downloads:
- **express** — web framework (creates the API server)
- **mysql2** — lets Node.js talk to MySQL
- **cors** — allows the browser to call the backend
- **nodemon** — auto-restarts server when you edit code

---

### 3C. Start the Backend Server

In the same terminal:
```bash
node server.js
```

You should see:
```
✅  Railway backend running at http://localhost:3000
📄  Open your browser at    http://localhost:3000
```

Keep this terminal **open** — if you close it, the server stops!

---

## 🌐 STEP 4 — OPEN THE FRONTEND

Open your browser and go to:
```
http://localhost:3000
```

The `index.html` file is automatically served by Express from the `frontend` folder.

You should see:
- ✅ "DB Connected" in green at the top right
- Dashboard showing data from MySQL (2 trains, 2 passengers, 2 tickets)

---

## 🔄 HOW IT ALL WORKS TOGETHER (Trace One Request)

### Example: "Add a new train"

```
1. User fills in form → clicks "Add Train"
             ↓
2. JavaScript calls:
   fetch('http://localhost:3000/api/trains', {
     method: 'POST',
     body: { name: 'Vande Bharat', source: 'Delhi', ... }
   })
             ↓
3. Express (server.js) receives the request
   → routes it to backend/routes/trains.js
             ↓
4. trains.js runs:
   INSERT INTO Trains (name, source, ...) VALUES (?, ?, ...)
             ↓
5. MySQL saves it to the database (permanent!)
             ↓
6. Backend replies: { message: 'Train added', train_id: 3 }
             ↓
7. Frontend shows toast: "Train added to database!"
   → Re-fetches all trains → Updates the table on screen
```

---

## 📡 API ENDPOINTS (All Routes Your Backend Exposes)

| Method | URL | What it does |
|--------|-----|--------------|
| GET | /api/trains | Get all trains |
| POST | /api/trains | Add a new train |
| DELETE | /api/trains/:id | Delete a train |
| GET | /api/passengers | Get all passengers |
| POST | /api/passengers | Add a passenger |
| DELETE | /api/passengers/:id | Delete a passenger |
| GET | /api/tickets | Get all tickets (with joins) |
| POST | /api/tickets | Book a ticket |
| PUT | /api/tickets/:id/cancel | Cancel a ticket |
| GET | /api/tickets/stats | Dashboard counts |

You can test these in browser:
→ `http://localhost:3000/api/trains` — shows all trains as JSON

---

## ❓ COMMON ERRORS & FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | MySQL is not running | Start MySQL service (search "Services" in Windows → start MySQL) |
| `ER_ACCESS_DENIED` | Wrong password in db.js | Update password in backend/db.js |
| `Cannot GET /api` | Backend not running | Run `node server.js` in terminal |
| `⬤ Backend Offline` in UI | Port 3000 not running | Start the backend again |
| `nodemon not found` | Dev packages not installed | Run `npm install` again |

---

## 🔁 DEVELOPMENT WORKFLOW (Daily Use)

Every time you want to work on this project:

1. Start MySQL (it might already be running)
2. Open terminal → `cd railway-system/backend` → `node server.js`
3. Open `http://localhost:3000` in browser
4. Make changes to code → refresh browser (or use nodemon for auto-reload)

To use nodemon (auto-restart on code change):
```bash
npm run dev
```

---

## 🎓 KEY CONCEPTS LEARNED

| Concept | Where You See It |
|---------|-----------------|
| **SQL CREATE TABLE** | database/schema.sql |
| **SQL INSERT** | routes/*.js using db.query() |
| **SQL SELECT with JOIN** | routes/tickets.js (GET /) |
| **SQL UPDATE** | routes/tickets.js (cancel) |
| **SQL DELETE** | routes/trains.js, passengers.js |
| **Primary Key (PK)** | train_id, passenger_id, ticket_id |
| **Foreign Key (FK)** | Tickets.train_id → Trains, Tickets.passenger_id → Passengers |
| **REST API** | server.js + routes folder |
| **JSON** | Data format between frontend ↔ backend |
| **async/await** | All fetch() calls in index.html |