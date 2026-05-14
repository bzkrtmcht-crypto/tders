const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database
const db = new sqlite3.Database(path.join(__dirname, 'db', 'tango.db'), (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS weeks (
    id INTEGER PRIMARY KEY,
    week_number INTEGER,
    title TEXT,
    goals TEXT,
    music TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS hours (
    id INTEGER PRIMARY KEY,
    week_id INTEGER,
    hour_number INTEGER,
    baslik TEXT,
    sure TEXT,
    hedefler TEXT,
    konu_baslikları TEXT,
    notlar TEXT,
    odevler TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (week_id) REFERENCES weeks(id) ON DELETE CASCADE
  )
`);

// Routes

// Ana sayfa - Tüm haftaları göster
app.get('/', (req, res) => {
  db.all('SELECT * FROM weeks ORDER BY week_number', (err, rows) => {
    if (err) return res.status(500).send('Veritabanı hatası');
    res.render('index', { weeks: rows || [] });
  });
});

// Hafta detayı (saatleri ile beraber)
app.get('/week/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM weeks WHERE id = ?', [id], (err, week) => {
    if (err) return res.status(500).send('Veritabanı hatası');
    if (!week) return res.status(404).send('Hafta bulunamadı');

    db.all('SELECT * FROM hours WHERE week_id = ? ORDER BY hour_number', [id], (err, hours) => {
      if (err) return res.status(500).send('Veritabanı hatası');
      res.render('week_detail', { week: week, hours: hours || [] });
    });
  });
});

// Yeni hafta oluştur (API)
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

// Hafta güncelle
app.put('/api/weeks/:id', (req, res) => {
  const id = req.params.id;
  const { week_number, title, goals, content, music, homework, common_mistakes } = req.body;

  db.run(
    `UPDATE weeks SET week_number=?, title=?, goals=?, content=?, music=?, homework=?, common_mistakes=? WHERE id=?`,
    [week_number, title, goals, content, music, homework, common_mistakes, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Hafta sil
app.delete('/api/weeks/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM weeks WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// HOURS (SAATLERİ) API

// Yeni saat ekle
app.post('/api/hours', (req, res) => {
  const { week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar, odevler } = req.body;

  db.run(
    `INSERT INTO hours (week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar, odevler)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar, odevler],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, success: true });
    }
  );
});

// Saat güncelle
app.put('/api/hours/:id', (req, res) => {
  const id = req.params.id;
  const { baslik, sure, hedefler, konu_baslikları, notlar, odevler } = req.body;

  db.run(
    `UPDATE hours SET baslik=?, sure=?, hedefler=?, konu_baslikları=?, notlar=?, odevler=? WHERE id=?`,
    [baslik, sure, hedefler, konu_baslikları, notlar, odevler, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Saat sil
app.delete('/api/hours/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM hours WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Server başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Tango Curriculum server çalışıyor!`);
  console.log(`📱 Bilgisayarda aç: http://localhost:${PORT}`);
  console.log(`📱 Telefondan aç: http://<BILGISAYAR_IP>:${PORT}`);
  console.log(`\nBilgisayarın IP adresini aşağıda bulabilirsin:`);
  console.log(`Terminal/PowerShell'de yazınız: ipconfig`);
  console.log(`"IPv4 Address" satırındaki IP'yi kopyala\n`);
});
