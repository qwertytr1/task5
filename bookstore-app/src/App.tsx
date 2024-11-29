import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Table, Spinner, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import Header from './header';
import BookDescription from './BookDescription'; // Импорт нового компонента

interface Book {
  index: number;
  isbn: string;
  title: string;
  authors: string;
  publisher: string;
  language: string;
  likes: number;
  reviews: string;
  description: {
    title: string;
    publisher: string;
    author: string;
    publicist: string;
    publicationDate: string;
  };
}

const App: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('USA');
  const [seed, setSeed] = useState<string>('58933423');
  const [likes, setLikes] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [lastIndex, setLastIndex] = useState<number>(0); // New state to keep track of the last index
  const [expandedBook, setExpandedBook] = useState<number | null>(null);

  const fetchBooks = async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    setLoading(true);
    try {
      // Calculate startIndex based on the last index from previous page
      const response = await axios.get('http://localhost:5050/generate-books', {
        params: { language, seed, likes, reviews, page },
      });
      const uniqueBooks = removeDuplicatesAndRenumber(response.data.books);
      setBooks((prevBooks) => [...prevBooks, ...uniqueBooks]);
     } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicatesAndRenumber = (books: Book[]): Book[] => {
    const seenIsbns = new Set();
    const uniqueBooks: Book[] = [];

    books.forEach((book) => {
      if (!seenIsbns.has(book.isbn)) {
        seenIsbns.add(book.isbn);
        uniqueBooks.push(book);
      }
    });

    // Set indices starting from the provided startIndex
    return uniqueBooks.map((book) => ({
      ...book,
    }));
  };

  useEffect(() => {
    setBooks([]); // Reset the books when filters change
    setPage(1); // Start from the first page
    fetchBooks(); // Fetch new books
  }, [language, region, seed, likes, reviews]);


  // Фильтрация книг после загрузки
  const filteredBooks = useMemo(() => {
    return books.filter((book) => book.likes >= likes);
  }, [books, likes]);
console.log(filteredBooks)
  const toggleBookDetails = (index: number) => {
    setExpandedBook((prevExpandedBook) => (prevExpandedBook === index ? null : index));
  };
  useEffect(() => {
    fetchBooks();
  }, [page]);
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10 && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment page when scrolled to bottom
    }
  };

  return (
    <Container className="app-container">
      <h1 className="app-title">Bookstore Random Data Generator</h1>
      <Header
        language={language}
        setLanguage={setLanguage}
        seed={seed}
        setSeed={setSeed}
        likes={likes}
        setLikes={setLikes}
        reviews={reviews}
        setReviews={setReviews}
      />
      <Row>
        <Col md={12}>
          <div className="table-wrapper" onScroll={handleScroll}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author(s)</th>
                  <th>Publisher</th>
                </tr>
              </thead>
              <tbody>
  {books.map((book, i) => (
    <React.Fragment key={i}>
      <tr>
        <td>
          <Button variant="link" onClick={() => setExpandedBook((prev) => (prev === book.index ? null : book.index))}>
            {expandedBook === book.index ? '▲' : '▼'}
          </Button>
        </td>
        <td>{i + 1}</td>
        <td>{book.isbn}</td>
        <td>{book.title}</td>
        <td>{book.authors}</td>
        <td>{book.publisher}</td>
      </tr>
      {expandedBook === book.index && (
        <tr>
          <td colSpan={6}>
            <BookDescription description={book.description} />
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
            </Table>
            {loading && (
              <div className="spinner-wrapper">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;