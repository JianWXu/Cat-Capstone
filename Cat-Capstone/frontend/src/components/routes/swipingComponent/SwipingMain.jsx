import React, { useState, useEffect } from 'react';
import CatApi from '../../../../../api.js';
import SwipeCard from './SwipingCard'; 

const SwipeComponent = ({ username, shouldShowSwiping }) => {
  const [cat, setCat] = useState(null);

  const fetchRandomCat = async () => {
    try {
      const response = await CatApi.getRandomCat(username);
      setCat(response);
    } catch (err) {
      console.error('Error fetching random cat:', err);
    }
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  const handleSwipe = async (direction, catId) => {
    const liked = direction === 'right';
    try {
      await CatApi.swipeRandomCat({ username, catId, liked });
      fetchRandomCat();
    } catch (err) {
      console.error('Error adding swipe:', err);
    }
  };

  return (
    shouldShowSwiping && (
        <div className="swipe-component">
      {cat && (
        <SwipeCard cat={cat} onSwipe={handleSwipe} />
      )}
    </div>
    )
    
  );
};

export default SwipeComponent;
