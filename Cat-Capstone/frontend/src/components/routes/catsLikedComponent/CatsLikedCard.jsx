import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import './catslikedcard.css';

function CatsLikedCard({ name, image, species, friendly, age, outdoor, ownerEmail, mutualLikes  }) {
    const [error, setError] = useState('');

    // Handle the email button click
  const handleEmailClick = () => {
    if (mutualLikes) {
      window.location.href = `mailto:${ownerEmail}`;
    } else {
      setError("The other user hasn't liked your cats yet.");
    }
  };

  return (
    <div className="cats-liked-card-div">
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={image} alt={`${name}`} />
        <Card.Body className="cats-liked-card-body">
          <Card.Title className="cats-liked-card-title">{name}</Card.Title>
          <Card.Text>
            <strong>Species:</strong> {species}<br />
            <strong>Friendly:</strong> {friendly ? 'Yes' : 'No'}<br />
            <strong>Age:</strong> {age}<br />
            <strong>Outdoor:</strong> {outdoor ? 'Yes' : 'No'}

          </Card.Text>
          <button className="email-button" onClick={handleEmailClick}>
            Email Owner
          </button>
          {error && <div className="error-message">{error}</div>}
        </Card.Body>
      </Card>
    </div>
  );
}

CatsLikedCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  species: PropTypes.string.isRequired,
  friendly: PropTypes.bool.isRequired,
  age: PropTypes.number.isRequired,
  outdoor: PropTypes.bool.isRequired,
};

export default CatsLikedCard;
