// SwipingMain.jsx
import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../../UserContext';
import CatApi from '../../../../../api';
import SwipeCard from './SwipingCard';

const SwipingMain = () => {
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState(null);
  const [error, setError] = useState(null);

  const fetchRandomCat = async () => {
    try {
      const response = await CatApi.getRandomCat(user.username);
      setCat(response); // Assuming the response is the cat data
      setError(null); // Clear previous errors if successful
      console.log(response.id)
    } catch (err) {
      console.error('Error fetching random cat:', err);
      setError('Could not fetch cat. Please try again later.');
    }
  };

  const handleSwipe = async (direction, catId) => {
    try {
      if (!user || !user.username) {
        throw new Error('Username is not available');
      }
      const liked = direction === 'right';
      await CatApi.swipeRandomCat(user.username, cat.id, liked);
    } catch (err) {
      console.error('Error handling swipe:', err);
    }
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {cat ? (
        <SwipeCard cat={cat} onSwipe={ handleSwipe } />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SwipingMain;
