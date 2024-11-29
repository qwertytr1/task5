const express = require('express');
const app = express();
const port = 5050;
const seedrandom = require('seedrandom');
const cors = require('cors');
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
  const { language = 'en', seed = Date.now(), likes = 10, reviews = 5, page = 1 } = req.query;

  console.log('Request received with params:', { language, seed, likes, reviews, page });

  const data = languageData[language] || languageData['en'];

  const minLikes = parseFloat(likes);
  const minReviews = parseInt(reviews, 10);


  const books = generateBooks(seed, page, minLikes, minReviews, data);


  const filteredBooks = books.filter(
    (book) => book.likes >= minLikes && book.reviews >= minReviews
  );


  res.json({ books: filteredBooks });
});

function generateBooks(seed, page, likes, reviews, data) {
  const rng = seedrandom(seed);
  const books = [];

  const { authors, publishers, titles, language: bookLanguage } = data;

  for (let i = 0; i < 20; i++) {
    const book = {
      isbn: generateISBN(rng),
      title: titles[Math.floor(rng() * titles.length)] || `Book ${i + 1}`,
      authors: authors[Math.floor(rng() * authors.length)] || `Author ${i + 1}`,
      publisher: publishers[Math.floor(rng() * publishers.length)] || `Publisher ${i + 1}`,
      language: bookLanguage,
      likes: Math.round(rng() * likes * 100) / 10,
      reviews: Math.round(rng() * 5 * 10) / 10,
      description: {
        title: titles[Math.floor(rng() * titles.length)] || `Generated Book ${i + 1}`,
        publisher: publishers[Math.floor(rng() * publishers.length)] || 'Unknown Publisher',
        author: authors[Math.floor(rng() * authors.length)] || 'Unknown Author',
        publicist: 'Publicist Name',
        publicationDate: `202${Math.floor(rng() * 10)}-01-01`
      }
    };
    books.push(book);
  }

  console.log("Generated books:", books);

  return books;
}
function generateISBN(rng) {
  return `978-3-${Math.floor(rng() * 1000000000)}`;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});