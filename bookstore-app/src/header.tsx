import React from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import "./header.css";

interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
  seed: string;
  setSeed: (seed: string) => void;
  likes: number;
  setLikes: (likes: number) => void;
  reviews: number;
  setReviews: (reviews: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  seed,
  setSeed,
  likes,
  setLikes,
  reviews,
  setReviews,
}) => {
  return (
    <div className="header-container d-flex flex-wrap justify-content-between gap-3 p-4">
      {/* Language Selector */}
      <div className="form-container">
        <FloatingLabel controlId="floatingSelect" label="Language & Region" className="mb-2" />
        <Form.Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="form-select-sm"
        >
          <option value="en">English (USA)</option>
          <option value="es">Spanish (Spain)</option>
          <option value="fr">French (France)</option>
        </Form.Select>
      </div>

      {/* Seed Input */}
      <div className="form-container">
        <FloatingLabel controlId="floatingSeed" label="Seed Value" className="mb-2" />
        <div className="input-group">
          <Form.Control
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter seed"
            className="form-control-sm"
          />
          <Button
            className="btn btn-secondary"
            onClick={() => setSeed(Math.floor(Math.random() * 1000000000).toString())}
          >
            🔄
          </Button>
        </div>
      </div>

      {/* Likes Slider */}
      <div className="form-container">
        <FloatingLabel controlId="floatingLikes" label="Likes" className="mb-2" />
        <Form.Control
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={likes}
          onChange={(e) => setLikes(parseFloat(e.target.value))}
          className="form-range"
        />
        <div className="small text-muted text-center mt-1">{likes.toFixed(1)}</div>
      </div>

      {/* Reviews Input */}
      <div className="form-container">
        <FloatingLabel controlId="floatingReviews" label="Reviews" className="mb-2" />
        <Form.Control
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={reviews}
          onChange={(e) => setReviews(parseFloat(e.target.value))}
          className="form-control-sm"
        />
      </div>
    </div>
  );
};

export default Header;
