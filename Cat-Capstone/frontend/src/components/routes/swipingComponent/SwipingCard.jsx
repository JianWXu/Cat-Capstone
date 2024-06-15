import React from 'react';
import TinderCard from 'react-tinder-card';
import './swiping.css';

const SwipeCard = ({ cat, onSwipe }) => {
  return (
    <TinderCard
      key={cat.id}
      onSwipe={(dir) => onSwipe(dir, cat.id)}
    >
      <div className="swipe-card">
        <h3>{cat.name}</h3>
        <img src={cat.image_url} alt={cat.name} />
        <p>{cat.description}</p>
      </div>
    </TinderCard>
  );
};

export default SwipeCard;
