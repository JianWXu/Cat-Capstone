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
    } catch (err) {
      console.error('Error fetching random cat:', err);
      setError('Could not fetch cat. Please try again later.');
    }
  };

  return (
    <div>
          <SwipeCard cat={cat} fetchRandomCat={fetchRandomCat} />
           
    </div>
  );
};

export default SwipingMain;
