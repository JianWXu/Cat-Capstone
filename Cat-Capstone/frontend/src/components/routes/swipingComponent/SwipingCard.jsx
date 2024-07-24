import React from 'react';
import TinderCard from 'react-tinder-card';
import './swiping.css';

const SwipeCard = ({ cat, onSwipe, }) => {
  const handleSwipe = (dir) => {
    console.log(`Swiped ${dir} on cat with ID ${cat.id}`);
    if (dir === 'left' || dir === 'right') {
      onSwipe(dir, cat.id);
    }
  };

  return (
    <TinderCard
      key={cat.id}
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']} // Prevent swipe up/down, only left/right are valid
      swipeThreshold={0.2} // Adjust swipe threshold to make swiping more sensitive
    >
      <div className="swipe-card">
        <h3>{cat.name}</h3>
        <img src={cat.pictures.image_url} alt={cat.name}  />
        <p>{cat.pictures.description}</p>
      </div>
    </TinderCard>
  );
};

export default SwipeCard;
