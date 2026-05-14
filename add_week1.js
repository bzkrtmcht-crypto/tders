const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'tango.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

// HAFTA 1 VERİLERİ
const week1Data = {
  week_number: 1,
  title: "Tango'ya Hosgeldiniz - Temel Adimlar ve Tutus",
  goals: "Tango'nun temelini anlamak, muzik ile ritim uyumu saglamak, partnerle iletisim kurmak, Abrazo ve Caminar'i ogrenmenk",

  content: JSON.stringify({
    saat1: {
      baslik: "Tango'ya Hosgeldiniz (Tanisma)",
      sure: "10 dakika",
      hedefler: [
        "Tango'nun ne oldugunu anlamak",
        "Neden onemli oldugunu gormek",
        "Bu dersi almaya heveslenebilmek"
      ]
    },

    saat2: {
      baslik: "Tango Nedir ve Tarihcesi",
      sure: "10 dakika",
      hedefler: [
        "Tango'nun kokenini anlamak",
        "Neden Tango diye adlandirildigini bilmek",
        "Tango'nun evrimi hakkinda bilgi sahibi olmak"
      ]
    },

    saat3: {
      baslik: "Muzik Dinleme ve Yuruyu Birlikte",
      sure: "10 dakika",
      hedefler: [
        "Tango muziginin yapisini anlamak",
        "Ritmi sayarak hissetmek",
        "Muzik ile bedensel hareket uyumunu kurma",
        "Ilk adimi (Caminar) atmak"
      ]
    },

    saat4: {
      baslik: "Muzik esliginde Partnerle Yuruyu ve Pratik Tutus",
      sure: "10 dakika",
      hedefler: [
        "Tango'nun en onemli unsuru olan Abrazo ogrenmenk",
        "Partner ile iletisim kurmak",
        "Lider-takipci rollerini anlamak"
      ]
    },

    saat5: {
      baslik: "Yan, Ileri, Geri Adim Yuruyu (Caminar Varyasyonlari)",
      sure: "10 dakika",
      hedefler: [
        "Caminar'in farkli yonlerini ogrenmenk",
        "Adim cesitlilgini arttirmak",
        "Muzik ile ritim uyumunu derinlestirmenk"
      ]
    },

    saat6: {
      baslik: "Toparlanma, Hedefler, Odevler",
      sure: "10 dakika",
      hedefler: [
        "Hafta 1'de neler ogrenildi toplamak",
        "Ogrencilerin sorularini yanitlamak",
        "Hafta 2'ye hazirlanma"
      ]
    }
  }, null, 2),

  music: JSON.stringify({
    yavaş_melankoli: [
      "El Dia Que Me Quieras - Carlos Gardel",
      "Mi Buenos Aires Querido - Carlos Gardel",
      "Adios Nonino - Astor Piazzolla"
    ],
    orta_tempo: [
      "La Cumparsita - Klasik Tango",
      "Tango Argentino - Anibal Troilo",
      "Caminito - Juan de Dios Filiberto"
    ]
  }, null, 2),

  homework: JSON.stringify({
    gun1_3: [
      "Gunluk 5 dakika muzik dinle",
      "Beat'i sayarak 3 kez tekrarla",
      "Yalniz Caminar pratiği 10 dakika",
      "Vucud bilincligini ayna karsisinda al"
    ],
    gun4_5: [
      "Abrazo Cerrado pozisyon pratiği",
      "Partnerle statik Caminar",
      "Muzik ile Caminar pratiği"
    ],
    gun6_7: [
      "Adim varyasyonlari tekrari",
      "Combo pratiği",
      "Serbest uygulama"
    ]
  }, null, 2),

  common_mistakes: JSON.stringify({
    hatalar: [
      {
        hata: "Muzik beatinden hizli adim atmak",
        cozum: "Metronomuna uygun adim at"
      },
      {
        hata: "Abrazo'da cok sert tutus",
        cozum: "Hafif ve esnek ol"
      },
      {
        hata: "Vucudun kati hareket etmesi",
        cozum: "Dizleri bukuk tut, govdeyi yumusak hareket ettir"
      }
    ]
  }, null, 2)
};

// Veritabanina ekle
db.run(
  `INSERT INTO weeks (week_number, title, goals, content, music, homework, common_mistakes)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    week1Data.week_number,
    week1Data.title,
    week1Data.goals,
    week1Data.content,
    week1Data.music,
    week1Data.homework,
    week1Data.common_mistakes
  ],
  function(err) {
    if (err) {
      console.error('HATA:', err.message);
      process.exit(1);
    }
    console.log('BASARILI - HAFTA 1 eklendi!');
    console.log(`Hafta ID: ${this.lastID}`);
    console.log(`Baslik: ${week1Data.title}`);
    db.close();
  }
);
