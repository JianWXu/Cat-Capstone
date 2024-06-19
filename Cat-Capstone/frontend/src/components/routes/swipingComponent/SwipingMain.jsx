import React, { useState, useEffect, useContext } from 'react';
import UserContext from "../../../userContext";
import CatApi from '../../../../../api';
import SwipeCard from './SwipingCard';

const SwipingMain = ({ shouldShowSwiping }) => {

  const {user} = useContext(UserContext)
  const [cat, setCat] = useState(null);
  const [error, setError] = useState(null);

  const username = JSON.parse(user).username

  const fetchRandomCat = async () => {
    try {
      const response = await CatApi.getRandomCat(username);
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
  }, [shouldShowSwiping]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {cat ? (
        <SwipeCard cat={cat} fetchRandomCat={fetchRandomCat} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SwipingMain;
