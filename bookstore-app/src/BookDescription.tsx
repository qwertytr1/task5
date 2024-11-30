import React from 'react';

interface BookDescriptionProps {
  description: {
    title: string;
    publisher: string;
    author: string;
    publicist: string;
    publicationDate: string;
  };
  likes: number;
  reviews: string;
}


const BookDescription: React.FC<BookDescriptionProps> = ({ description, likes, reviews }) => {
  return (
    <div className="book-description">
      <strong>Title:</strong> {description.title} <br />
      <strong>Publisher:</strong> {description.publisher} <br />
      <strong>By:</strong> {description.author} <br />
      <strong>Publicist:</strong> {description.publicist} <br />
      <strong>Publication Date:</strong> {description.publicationDate} <br />
      <div className="likes-reviews">
        <span><strong>Likes:</strong> {likes}</span>
        <span><strong>Reviews:</strong> {reviews}</span>
      </div>
    </div>
  );
};

export default BookDescription;