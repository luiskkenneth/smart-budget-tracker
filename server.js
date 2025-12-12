// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// ... (Other middleware and static serving code)

// SQLite database setup
// ❌ ORIGINAL: const db = new sqlite3.Database('./database.db', (err) => {
// ✅ BAGONG LALAGYAN: Gagamit ng ':memory:'
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) return console.error(err.message);
    // TANDAAN: Kapag ':memory:' ang ginamit, mawawala ang data sa tuwing magre-restart ang server.
    console.log("Connected to in-memory SQLite database"); 
});

// Create table if not exists (Ito ay tatakbo sa tuwing mag-uumpisa ang server)
db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        description TEXT,
        category TEXT,
        amount REAL,
        date TEXT
    )
`);

// ... (Other routes: /api/transactions, /api/transactions/:id, /api/reset)

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));