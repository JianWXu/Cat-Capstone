import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../../UserContext';
import CatApi from '../../../../../api';
import SwipeCard from './SwipingCard';

const SwipingMain = ({ shouldShowSwiping }) => {
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState(null);
  const [error, setError] = useState(null);

  const fetchRandomCat = async () => {
    try {
      const response = await CatApi.getRandomCat(user.username);
      setCat(response); // Assuming the response is the cat data
      setError(null); // Clear previous errors if successful
    } catch (err) {
      console.error('Error fetching random cat:', err);
      setError('Could not fetch cat. Please try again later.');
    }
  };

  useEffect(() => {
    if (shouldShowSwiping) {
      fetchRandomCat();
    }
  }, [shouldShowSwiping, user.username]); // Ensure fetchRandomCat is called whenever shouldShowSwiping or username changes

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {shouldShowSwiping && (
        cat ? (
          <SwipeCard cat={cat} fetchRandomCat={fetchRandomCat} />
        ) : (
          <div>Loading...</div>
        )
      )}
    </div>
  );
};

export default SwipingMain;
