import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../../UserContext';
import CatApi from '../../../api';
import SwipeCard from './SwipingCard';
import './SwipingMain.css'; // Ensure to import the CSS file

const SwipingMain = () => {
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState(null);
  const [error, setError] = useState(null);
  const [noMoreCats, setNoMoreCats] = useState(false);

  const fetchRandomCat = async () => {
    try {
      const response = await CatApi.getRandomCat(user.username);
      if (response.message === "No more cats to swipe" || response.message === "No cats available") {
        setNoMoreCats(true);
        setCat(null);
        setError(null);
      } else {
        setCat(response);
        setError(null);
        setNoMoreCats(false);
      }
    } catch (err) {
      console.error('Error fetching random cat:', err);
      setError('Could not fetch cat. Please try again later.');
      setNoMoreCats(false);
    }
  };

  const handleSwipe = async (direction, catId) => {
    try {
      if (!user || !user.username) {
        throw new Error('Username is not available');
      }
      const liked = direction === 'right';
      await CatApi.swipeRandomCat(user.username, cat.id, liked);
      await fetchRandomCat();
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

  if (noMoreCats) {
    return <div>You have swiped all the cats available at the moment. Please check back later!</div>;
  }

  return (
    <div className="swiping-main-container">
      <div className="swiping-main-title">Swipe Your Favorite Cats</div>
      {cat ? (
        <SwipeCard cat={cat} onSwipe={handleSwipe} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SwipingMain;
