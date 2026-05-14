const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'tango.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

// Eski veriyi sil
db.run('DELETE FROM weeks WHERE week_number = 1', (err) => {
  if (err) console.error('Silme hatası:', err);
});

// Hafta 1'i ekle
db.run(
  `INSERT INTO weeks (week_number, title, goals, music)
   VALUES (?, ?, ?, ?)`,
  [1, "Tango'ya Hosgeldiniz - Temel Adimlar ve Tutus", "Tango'nun temelini anlamak, muzik ile ritim uyumu saglamak, partnerle iletisim kurmak", JSON.stringify({
    yavaş: ["El Dia Que Me Quieras - Carlos Gardel", "Mi Buenos Aires Querido - Carlos Gardel"],
    orta: ["La Cumparsita", "Tango Argentino - Anibal Troilo"],
    hizli: ["Libertango - Astor Piazzolla"]
  })],
  function(err) {
    if (err) {
      console.error('Hafta ekleme hatası:', err);
      process.exit(1);
    }

    const weekId = this.lastID;
    console.log(`Hafta 1 eklendi (ID: ${weekId})`);

    // 6 saati ekle
    const hours = [
      {
        hour: 1,
        baslik: "Tango'ya Hosgeldiniz (Tanisma)",
        sure: "10 dakika",
        hedefler: "Tango'nun ne oldugunu anlamak; Neden onemli oldugunu gormek; Bu dersi almaya heveslenebilmek",
        konu: "Giriş & Motivasyon; Tango Nedir?; Neden Tango?; Tango'nun Ruhu; Dersin Hedefleri",
        notlar: "Müzik örneği ve kısa video gösterimlerini dahil et"
      },
      {
        hour: 2,
        baslik: "Tango Nedir ve Tarihcesi",
        sure: "10 dakika",
        hedefler: "Tango'nun kokenini anlamak; Tango'nun adinin kokenini bilmek; Tango'nun evrimi hakkinda bilgi almak",
        konu: "Tango Nedir (4 Unsur); Tango Adinin Kökeni; Tango Tarihi 1880-Gunumuz; Tango Kulturu",
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
        konu: "Tango'da Iletisim: Abrazo; Abrazo Turleri (Cerrado, Semi-abierto, Abierto); Abrazo Cerrado Uygulamasi; Partnerle Caminar",
        notlar: "Abrazo pozisyon diyagramlari ve profesyonel video ornekleri"
      },
      {
        hour: 5,
        baslik: "Yan, Ileri, Geri Adim Yuruyu",
        sure: "10 dakika",
        hedefler: "Caminar'in farkli yonlerini ogrenmenk; Adim cesitlilgini arttirmak; Kombinasyonlar yapmak",
        konu: "Marcha Lateral (Yan Adim); Marcha Adelante Varyasyonlari (Ileri); Marcha Atras Varyasyonlari (Geri); Kombinasyon Pratiği",
        notlar: "Her adim tipinin video demonstrasyonu hazirla"
      },
      {
        hour: 6,
        baslik: "Toparlanma, Hedefler, Odevler",
        sure: "10 dakika",
        hedefler: "Hafta 1'de ogrenilenler toplamak; Sorulari yanitlamak; Hafta 2'ye hazirlanma; Ev odeviyle yonlendirmek",
        konu: "Hafta 1 Ozeti; Onemli Konu Baslikları; Sorular & Tartisma; Hafta 2 Preview; Ev Odevileri",
        notlar: "Motivasyon mesajı ile kapat, hafta 2 preview yap. Odevler: gunluk 20-30 dakika pratik"
      }
    ];

    let added = 0;
    hours.forEach((h, idx) => {
      db.run(
        `INSERT INTO hours (week_id, hour_number, baslik, sure, hedefler, konu_baslikları, notlar)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [weekId, h.hour, h.baslik, h.sure, h.hedefler, h.konu, h.notlar],
        function(err) {
          if (err) console.error(`Saat ${h.hour} ekleme hatası:`, err);
          else added++;

          if (added === hours.length) {
            console.log(`\n✅ Migration basarili!\n`);
            console.log(`📚 Hafta 1 oluşturuldu`);
            console.log(`⏰ 6 saat (10 dakikalık bölüm) eklendi`);
            console.log(`\nHer saat için kutucuk yapısı:`);
            console.log("  - Başlık");
            console.log("  - Süre (10 dakika)");
            console.log("  - Hedefler");
            console.log("  - Konu başlıkları");
            console.log("  - Notlar");
            db.close();
          }
        }
      );
    });
  }
);
