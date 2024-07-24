import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../../UserContext';
import CatApi from '../../../../../api';
import './updateCat.css';

function AppUpdateCat() {
  const { user } = useContext(UserContext);
  const { catId } = useParams();
  const token = localStorage.getItem('token');

  const INITIAL_STATE = {
    name: '',
    age: '',
    outdoor: false,
    friendly: false,
    title: '',
    description: '',
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [catName, setCatName] = useState('');

  useEffect(() => {
    async function fetchCatDetails() {
      try {
        const catData = await CatApi.getCatDetails(catId);
        setFormData({          
          age: catData.age,
          outdoor: catData.outdoor,
          friendly: catData.friendly,
          title: catData.pictures.title || '',
          description: catData.pictures.description || '',
        });
        setCatName(catData.name);  // Set the cat's name here
      } catch (err) {
        console.error("Error fetching cat details:", err);
      }
    }

    fetchCatDetails();
  }, [catId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append("age", formData.age);
    form.append("outdoor", formData.outdoor);
    form.append("friendly", formData.friendly);
    
    if (formData.title || formData.description) {
      form.append("picture[title]", formData.title);
      form.append("picture[description]", formData.description);
    }
    
    if (image) {
      form.append("image", image); // Make sure this field matches the one in multer
    }
  
    try {
      const res = await CatApi.updateCat(catId, user.username, form);
      setMessage("Cat updated successfully");
      setMessageType("success");
    } catch (err) {
      setMessage("Error updating cat");
      setMessageType("error");
      console.error("Error updating cat:", err);
    }
  };

  return (
    <div>
      {message && (
        <div className={`flash-message ${messageType}`}>
          {message}
        </div>
      )}
      <div className="update-cat-container">
        <h2>{catName}</h2> {/* Display the cat's name here */}
        <form className="update-cat-form" onSubmit={handleSubmit}>
          
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />

          <label htmlFor="outdoor">Outdoor:</label>
          <input
            id="outdoor"
            type="checkbox"
            name="outdoor"
            checked={formData.outdoor}
            onChange={handleChange}
          />

          <label htmlFor="friendly">Friendly:</label>
          <input
            id="friendly"
            type="checkbox"
            name="friendly"
            checked={formData.friendly}
            onChange={handleChange}
          />

          <label htmlFor="title">Picture Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label htmlFor="description">Picture Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label htmlFor="image">Upload Picture:</label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={handleImageChange}
          />

          <button type="submit">Update Cat</button>
        </form>
      </div>
    </div>
  );
}

export default AppUpdateCat;
