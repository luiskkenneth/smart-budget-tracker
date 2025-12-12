const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
// 1. Ginamit ang process.env.PORT para sa deployment, o 3000 kung local
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (index.html, script.js, style.css, etc.)
// Ito ang magse-serve ng index.html sa root path '/'
app.use(express.static(__dirname));

// ❌ Tinanggal ang app.get('/', ...) upang maiwasan ang conflict sa express.static(__dirname)

// 2. SQLite database setup - Ginamit ang ':memory:' para sa free deployment (Data is temporary)
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to in-memory SQLite database");
});

// Create table if not exists (Tatakbo ito tuwing magsisimula ang server)
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


// Fetch all transactions
app.get('/api/transactions', (req, res) => {
    // Nagdagdag ng ORDER BY id DESC para makita ang pinakabagong entry sa taas ng table
    db.all("SELECT * FROM transactions ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// Add a transaction
app.post("/api/transactions", (req, res) => {
    // Ang description ay hindi ginagamit sa frontend, kaya nilagyan ng default value na 'N/A'
    const { type, description = 'N/A', category, amount, date } = req.body; 

    db.run(
        `INSERT INTO transactions (type, description, category, amount, date)
         VALUES (?, ?, ?, ?, ?)`,
        [type, description, category, amount, date],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({ id: this.lastID });
        }
    );
});


// Delete route
app.delete("/api/transactions/:id", (req, res) => {
    db.run("DELETE FROM transactions WHERE id = ?", [req.params.id], function(err){
        if (err) return res.status(500).send(err);
        res.send({ deleted: true });
    });
});

// Reset route (optional but useful)
app.post("/api/reset", (req, res) => {
    db.run("DELETE FROM transactions", [], function(err){
        if (err) return res.status(500).send(err);
        res.send({ reset: true });
    });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));