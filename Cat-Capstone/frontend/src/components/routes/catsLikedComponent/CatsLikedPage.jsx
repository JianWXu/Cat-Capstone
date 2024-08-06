import UserContext from "../../../UserContext";
import React, { useEffect, useState, useContext } from 'react';
import CatsLikedCarousel from './CatsLikedCarousel';
import CatApi from '../../../../../api';
import "./catsLikedPage.css"

function AppCatsLikedPage() {
  const { user } = useContext(UserContext);
  const [likedCats, setLikedCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLikedCats() {
      try {
        console.log("Fetching liked cats for user:", user.username);
        const cats = await CatApi.getLikedCats(user.username);
        console.log("Fetched liked cats:", cats);
        setLikedCats(cats);
      } catch (error) {
        console.error("Error fetching liked cats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user.username) {
      fetchLikedCats();
    } else {
      console.error("Username is not available in user context");
      setLoading(false);
    }
  }, [user.username]);

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
    <div className="app-cats-liked-page">
      <h1>Cats You Liked</h1>
      {likedCats.length > 0 ? (
        <CatsLikedCarousel 
          cards={likedCats} 
          getMutualLikes={getMutualLikes}
        />
      ) : (
        <p>You have not liked any cats yet. Start exploring and find your favorites!</p>
      )}
    </div>
  );
}

export default AppCatsLikedPage;
