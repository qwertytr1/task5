const express = require('express');
const seedrandom = require('seedrandom');
const cors = require('cors');

const app = express();
require('dotenv').config();
// Разрешить CORS для любых источников (или укажите ваш домен)
app.use(cors());

const languageData = {
  en: {
    authors: ['John Doe', 'Jane Smith', 'James Brown', 'Mary Johnson', 'Robert White', 'Alice Green',
              'William Turner', 'Laura Hill', 'Michael King', 'Susan Adams'],
    publishers: ['Random House', 'Penguin Books', 'HarperCollins', 'Macmillan', 'Oxford Press', 'Scholastic', 'Hachette'],
    titles: ['The Great Adventure', 'Mystery of the Night', 'Journey to the West', 'Lost in Time', 'Beyond the Stars',
             'The Lost Kingdom', 'Secrets of the Past', 'Through the Looking Glass'],
    reviews: ['A must-read!', 'Incredible story!', 'Captivating from start to finish!', 'A thrilling adventure!', 'Heartwarming and inspiring.'],
    language: 'English'
  },
  es: {
    authors: ['Juan Pérez', 'María López', 'José Rodríguez', 'Ana García', 'Carlos Martínez', 'Isabel Sánchez',
              'Luis Gómez', 'Patricia Torres', 'Pedro Hernández', 'Dolores Díaz'],
    publishers: ['Casa del Libro', 'Ediciones Santillana', 'Editorial Planeta', 'Penguin Random House', 'Editorial Anagrama'],
    titles: ['La gran aventura', 'El misterio de la noche', 'Viaje al Oeste', 'Perdidos en el tiempo', 'Más allá de las estrellas',
             'El reino perdido', 'Secretos del pasado', 'A través del espejo'],
    reviews: ['¡Una lectura obligada!', '¡Increíble historia!', '¡Cautivadora de principio a fin!', '¡Una aventura fascinante!', 'Conmovedora e inspiradora.'],
    language: 'Spanish'
  },
  fr: {
    authors: ['Jean Dupont', 'Marie Lefevre', 'Pierre Martin', 'Sophie Bernard', 'Claude Robert', 'Isabelle Moreau',
              'Michel Lefevre', 'Claire Durand', 'Marc Boucher', 'Lucie Simon'],
    publishers: ['Éditions Gallimard', 'Le Seuil', 'Flammarion', 'Hachette Livre', 'Actes Sud'],
    titles: ['La grande aventure', 'Le mystère de la nuit', 'Voyage vers l\'Ouest', 'Perdus dans le temps', 'Au-delà des étoiles',
             'Le royaume perdu', 'Secrets du passé', 'À travers le miroir'],
    reviews: ['À lire absolument!', 'Histoire incroyable!', 'Captivant du début à la fin!', 'Une aventure palpitante!', 'Réconfortant et inspirant.'],
    language: 'French'
  }
};

app.get('/generate-books', (req, res) => {
  const { language = 'en', seed = Date.now(), page = 1 } = req.query;

  const data = languageData[language] || languageData['en'];
  const books = generateBooks(seed, page, data);

  res.json({ books });
});

function generateBooks(seed, page, data) {
  const rng = seedrandom(seed);
  const books = [];
  const { authors, publishers, titles, language: bookLanguage } = data;

  for (let i = 0; i < 20; i++) {
    const title = titles[Math.floor(rng() * titles.length)];
    const author = authors[Math.floor(rng() * authors.length)];
    const publisher = publishers[Math.floor(rng() * publishers.length)];
    const book = {
      isbn: generateISBN(rng),
      title,
      authors: author,
      publisher,
      language: bookLanguage,
      likes: Math.round(rng() * 10 * 10) / 10, // Лайки от 0 до 10 с дробными
      reviews: Math.round(rng() * 5 * 10) / 10, // Отзывы от 0 до 10 с дробными
      description: {
        title,
        publisher,
        author,
        publicist: 'Publicist Name',
        publicationDate: `202${Math.floor(rng() * 10)}-01-01`,
      },
    };
    books.push(book);
  }

  return books;
}

function generateISBN(rng) {
  return `978-3-${Math.floor(rng() * 1000000000)}`;
}

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
