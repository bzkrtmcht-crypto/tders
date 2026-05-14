const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'tango.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

console.log('Creating tables...\n');

// Drop old tables (migration)
db.run('DROP TABLE IF EXISTS hours', (err) => {
  if (err) console.error('Drop hours error:', err);
});

// Create weeks table
db.run(`
  CREATE TABLE IF NOT EXISTS weeks (
    id INTEGER PRIMARY KEY,
    week_number INTEGER,
    title TEXT,
    goals TEXT,
    music TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error('Create weeks error:', err);
  else console.log('✅ Weeks table created');
});

// Create hours table
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
`, (err) => {
  if (err) console.error('Create hours error:', err);
  else console.log('✅ Hours table created');

  // Now insert data
  setTimeout(() => {
    insertData();
  }, 500);
});

function insertData() {
  // Delete old week 1
  db.run('DELETE FROM weeks WHERE week_number = 1', (err) => {
    if (err) console.error('Delete error:', err);

    // Insert week 1
    db.run(
      `INSERT INTO weeks (week_number, title, goals, music)
       VALUES (?, ?, ?, ?)`,
      [
        1,
        "Tango'ya Hosgeldiniz - Temel Adimlar ve Tutus",
        "Tango'nun temelini anlamak, muzik ile ritim uyumu saglamak, partnerle iletisim kurmak",
        JSON.stringify({
          yavaş: ["El Dia Que Me Quieras - Carlos Gardel", "Mi Buenos Aires Querido - Carlos Gardel"],
          orta: ["La Cumparsita", "Tango Argentino - Anibal Troilo"],
          hizli: ["Libertango - Astor Piazzolla"]
        })
      ],
      function(err) {
        if (err) {
          console.error('Insert week error:', err);
          process.exit(1);
        }

        const weekId = this.lastID;
        console.log(`\n📚 Hafta 1 eklendi (ID: ${weekId})\n`);

        // Insert 6 hours
        const hours = [
          {
            hour: 1,
            baslik: "Tango'ya Hosgeldiniz (Tanisma)",
            sure: "10 dakika",
            hedefler: "Tango'nun ne oldugunu anlamak; Neden onemli oldugunu gormek; Bu dersi almaya heveslenebilmek",
            konu: "Giris & Motivasyon; Tango Nedir?; Neden Tango?; Tango'nun Ruhu; Dersin Hedefleri",
            notlar: "Muzik ornegi ve kisa video gosterimlerini dahil et"
          },
          {
            hour: 2,
            baslik: "Tango Nedir ve Tarihcesi",
            sure: "10 dakika",
            hedefler: "Tango'nun kokenini anlamak; Tango'nun adinin kokenini bilmek; Tango'nun evrimi hakkinda bilgi almak",
            konu: "Tango Nedir (4 Unsur); Tango Adinin Kokeni; Tango Tarihi 1880-Gunumuz; Tango Kulturu",
            notlar: "Carlos Gardel ve Astor Piazzolla portreleri, Buenos Aires resimleri"
          },
          {
            hour: 3,
            baslik: "Muzik Dinleme ve Yuruyu Birlikte",
            sure: "10 dakika",
            hedefler: "Tango muziginin yapisini anlamak; Ritmi sayarak hissetmek; Muzik ile hareket uyumu kurmak",
            konu: "Tango Muziginin Yapisi; KONTEO (Sayma); Muzik Dinleme Becerisi; CAMINAR (Tango Yuruyusu)",
            notlar: "Metronom (60 BPM) ile baslat, sonra tango muzigine gec"
          },
          {
            hour: 4,
            baslik: "Muzik esliginde Partnerle Tutus",
            sure: "10 dakika",
            hedefler: "Abrazo ogrenmenk; Partner ile iletisim kurmak; Lider-takipci rollerini anlamak",
            konu: "Tango'da Iletisim: Abrazo; Abrazo Turleri; Abrazo Cerrado Uygulamasi; Partnerle Caminar",
            notlar: "Abrazo pozisyon diyagramlari ve profesyonel video ornekleri"
          },
          {
            hour: 5,
            baslik: "Yan, Ileri, Geri Adim Yuruyu",
            sure: "10 dakika",
            hedefler: "Caminar'in farkli yonlerini ogrenmenk; Adim cesitlilgini arttirmak; Kombinasyonlar yapmak",
            konu: "Marcha Lateral (Yan Adim); Marcha Adelante Varyasyonlari; Marcha Atras Varyasyonlari; Kombinasyon Pratiği",
            notlar: "Her adim tipinin video demonstrasyonu hazirla"
          },
          {
            hour: 6,
            baslik: "Toparlanma, Hedefler, Odevler",
            sure: "10 dakika",
            hedefler: "Hafta 1'de ogrenilenler toplamak; Sorulari yanitlamak; Hafta 2'ye hazirlanma",
            konu: "Hafta 1 Ozeti; Onemli Konu Baslikları; Sorular & Tartisma; Hafta 2 Preview; Ev Odevileri",
            notlar: "Motivasyon mesaji ile kapat, hafta 2 preview yap. Odevler: gunluk 20-30 dakika pratik"
          }
        ];

        let added = 0;
        hours.forEach((h) => {
          db.run(
            `INSERT INTO hours (week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [weekId, h.hour, h.baslik, h.sure, h.hedefler, h.konu, h.notlar],
            function(err) {
              if (err) console.error(`Saat ${h.hour} error:`, err);
              else {
                console.log(`✅ Saat ${h.hour}: ${h.baslik}`);
                added++;
              }

              if (added === hours.length) {
                console.log(`\n✅✅✅ MIGRATION BASARILI!\n`);
                console.log(`📊 Veritabani Yapisi:`);
                console.log(`   - 1 Hafta (ID: ${weekId})`);
                console.log(`   - 6 Saat (10 dakikalik bölümler)`);
                console.log(`\n🎭 Her saatin kutucugu:`);
                console.log(`   - Baslik`);
                console.log(`   - Sure (10 dakika)`);
                console.log(`   - Hedefler`);
                console.log(`   - Konu Baslikları`);
                console.log(`   - Notlar\n`);
                db.close();
              }
            }
          );
        });
      }
    );
  });
}
