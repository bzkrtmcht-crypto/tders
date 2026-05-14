const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'tango.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

db.all('SELECT * FROM weeks ORDER BY week_number', (err, rows) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Veritabanında toplam ' + (rows ? rows.length : 0) + ' hafta var:\n');
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        console.log(`\n📚 Hafta ${row.week_number}: ${row.title}`);
        console.log(`   ID: ${row.id}`);
        console.log(`   Amaçlar: ${row.goals ? row.goals.substring(0, 50) + '...' : 'Boş'}`);
      });
    } else {
      console.log('❌ Veritabanı boş! Hiç hafta eklenmemiş.');
    }
  }
  db.close();
});
