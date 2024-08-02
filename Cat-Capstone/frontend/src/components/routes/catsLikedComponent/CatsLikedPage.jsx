import UserContext from "../../../UserContext";
import React, { useEffect, useState, useContext } from 'react';
import CatsLikedCarousel from './CatsLikedCarousel';
import CatApi from '../../../../../api';

function AppCatsLikedPage() {
  const { user } = useContext(UserContext);  // Removed username prop since it's derived from context
  const [likedCats, setLikedCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLikedCats() {
      try {
        const cats = await CatApi.getLikedCats(user.username);
        setLikedCats(cats);
      } catch (error) {
        console.error("Error fetching liked cats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user.username) {
      fetchLikedCats();
    }
  }, [user.username]); // Dependency on user.username

  // Function to get mutual likes
  const getMutualLikes = async () => {
    try {
      const mutualLikes = await CatApi.getMutualLike(user.username);
      return mutualLikes;
    } catch (error) {
      console.error("Error fetching mutual likes:", error);
      return [];
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Cats You Liked</h1>
      <CatsLikedCarousel 
        cards={likedCats} 
        getMutualLikes={getMutualLikes} // Pass the function to CatsLikedCarousel
      />
    </div>
  );
}

export default AppCatsLikedPage;
