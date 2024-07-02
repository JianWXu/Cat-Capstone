import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CatApi from '../../../../../api';

function CatDetails() {
  const { catId } = useParams();
  const [cat, setCat] = useState(null);

  useEffect(() => {
    async function fetchCatDetails() {
      try {
        const catData = await CatApi.getCatDetails(catId);
        setCat(catData);
      } catch (err) {
        console.error("Error fetching cat details:", err);
      }
    }

    fetchCatDetails();
  }, [catId]);

  if (!cat) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{cat.name}</h1>
      <img src={cat.image_url} alt={cat.name} />
      <p>Breed: {cat.breed}</p>
      <p>Age: {cat.age}</p>
      <p>Description: {cat.description}</p>
    </div>
  );
}

export default CatDetails;
