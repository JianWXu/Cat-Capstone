import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../../userContext';
import { useNavigate } from 'react-router-dom';
import CatApi from '../../../../../api';

function EditCats() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to home if user is not logged in
    } else {
      async function fetchCats() {
        try {
          const catsData = await CatApi.getUserCats(user.username);
          setCats(catsData);
        } catch (err) {
          console.error("Error fetching cats:", err);
        }
      }

      fetchCats();
    }
  }, [user, navigate]);

  // Add logic to handle cat editing here

  return (
    <div>
      <h1>Edit Cats</h1>
      {cats.length > 0 ? (
        <ul>
          {cats.map(cat => (
            <li key={cat.id}>
              {cat.name} - {cat.breed} - {cat.age}
              {/* Add edit functionality here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cats found.</p>
      )}
    </div>
  );
}

export default EditCats;
