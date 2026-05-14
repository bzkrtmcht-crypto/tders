const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database(path.join(__dirname, 'db', 'tango.db'), (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('✅ Database connected');
});

// Create tables
db.run(`CREATE TABLE IF NOT EXISTS weeks (
  id INTEGER PRIMARY KEY,
  week_number INTEGER,
  title TEXT,
  goals TEXT,
  content TEXT,
  music TEXT,
  homework TEXT,
  common_mistakes TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS hours (
  id INTEGER PRIMARY KEY,
  week_id INTEGER,
  hour_number INTEGER,
  baslik TEXT,
  sure TEXT,
  hedefler TEXT,
  konu_baslikları TEXT,
  notlar TEXT
)`);

// API Routes
app.get('/api/weeks', (req, res) => {
  db.all('SELECT * FROM weeks ORDER BY week_number', (err, rows) => {
    res.json(rows || []);
  });
});

app.get('/api/weeks/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM weeks WHERE id = ?', [id], (err, week) => {
    if (err || !week) return res.status(404).json({ error: 'Not found' });

    db.all('SELECT * FROM hours WHERE week_id = ? ORDER BY hour_number', [id], (err, hours) => {
      res.json({ week, hours: hours || [] });
    });
  });
});

app.post('/api/weeks', (req, res) => {
  const { week_number, title, goals, content, music, homework, common_mistakes } = req.body;
  db.run(
    `INSERT INTO weeks (week_number, title, goals, content, music, homework, common_mistakes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [week_number, title, goals, content, music, homework, common_mistakes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, success: true });
    }
  );
});

app.put('/api/weeks/:id', (req, res) => {
  const { week_number, title, goals, content, music, homework, common_mistakes } = req.body;
  db.run(
    `UPDATE weeks SET week_number=?, title=?, goals=?, content=?, music=?, homework=?, common_mistakes=? WHERE id=?`,
    [week_number, title, goals, content, music, homework, common_mistakes, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/weeks/:id', (req, res) => {
  db.run('DELETE FROM weeks WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/hours', (req, res) => {
  const { week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar } = req.body;
  db.run(
    `INSERT INTO hours (week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, success: true });
    }
  );
});

app.put('/api/hours/:id', (req, res) => {
  const { baslik, sure, hedefler, konu_baslikları, notlar } = req.body;
  db.run(
    `UPDATE hours SET baslik=?, sure=?, hedefler=?, konu_baslikları=?, notlar=? WHERE id=?`,
    [baslik, sure, hedefler, konu_baslikları, notlar, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/hours/:id', (req, res) => {
  db.run('DELETE FROM hours WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Tango Curriculum Server çalışıyor!`);
  console.log(`📱 http://localhost:${PORT}\n`);
});
