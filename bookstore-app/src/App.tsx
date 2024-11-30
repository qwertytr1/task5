import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Table, Spinner, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import Header from './header';
import BookDescription from './BookDescription';

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
  const [seed, setSeed] = useState<string>('42');
  const [likes, setLikes] = useState<number>(0); // State for likes filter
  const [reviews, setReviews] = useState<number>(0); // State for reviews filter
  const [books, setBooks] = useState<Book[]>([]); // State for all books
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1); // Current page
  const [expandedBook, setExpandedBook] = useState<number | null>(null);

  // Fetch books from the server
  const fetchBooks = async () => {
    if (loading) return; // Prevent multiple API calls
    setLoading(true);
    try {
      const response = await axios.get('https://task5-serv.vercel.app/generate-books', {
        params: { language, seed, region, page },
      });

      // Combine the new books with the existing ones
      const newBooks = removeDuplicates([...books, ...response.data.books]);

      setBooks(newBooks); // Add new books to the state
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility to remove duplicates based on ISBN
  const removeDuplicates = (books: Book[]): Book[] => {
    const seenIsbns = new Set();
    return books.filter((book) => {
      if (seenIsbns.has(book.isbn)) {
        return false;
      }
      seenIsbns.add(book.isbn);
      return true;
    });
  };

  // Reset state when filters or seed change
  useEffect(() => {
    setBooks([]); // Clear the books when changing language, seed, or region
    setPage(1); // Reset to first page
  }, [seed, language, region]);

  // Fetch books when the page changes or initial load
  useEffect(() => {
    fetchBooks();
  }, [page]);

  // Handle infinite scroll
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10 && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment the page number when scrolling to the bottom
    }
  };

  // Apply filters to the books
  const filteredBooks = useMemo(() => {
    if (likes === 0 && reviews === 0) {
      return books;
    }
    return books.filter(
      (book) =>
        (likes === 0 || Number(book.likes) >= likes) &&
        (reviews === 0 || Number(book.reviews) >= reviews)
    );
  }, [books, likes, reviews]);

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
                {filteredBooks.map((book, i) => (
                  <React.Fragment key={book.isbn}>
                    <tr>
                      <td>
                        <Button
                          variant="link"
                          onClick={() =>
                            setExpandedBook((prev) => (prev === i ? null : i))
                          }
                        >
                          {expandedBook === i ? '▲' : '▼'}
                        </Button>
                      </td>
                      <td>{i + 1}</td>
                      <td>{book.isbn}</td>
                      <td>{book.title}</td>
                      <td>{book.authors}</td>
                      <td>{book.publisher}</td>
                    </tr>
                    {expandedBook === i && (
                      <tr>
                        <td colSpan={6}>
                          <BookDescription
                            description={book.description}
                            likes={book.likes}
                            reviews={book.reviews}
                          />
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
