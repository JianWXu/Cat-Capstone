// LandingPageCard.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import "./landingpagecard.css"

function LandingPageCard({ title, text }) {
  return (
    <div className="landing-page-card-div">
      <Card style={{ width: '18rem' }}>
      <Card.Body className="landing-page-card-body">
        <Card.Title className="landing-page-card-title">{title}</Card.Title>
        <hr />
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
    </div>
    
  );
}

LandingPageCard.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LandingPageCard;