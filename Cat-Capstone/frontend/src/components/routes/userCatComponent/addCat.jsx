import React, { useState, useContext } from 'react';
import UserContext from '../../../UserContext';
import CatApi from '../../../api';
import './addCat.css';

function AppAddCat() {
  const { user } = useContext(UserContext);


  const INITIAL_STATE = {
    name: '',
    breed: '',
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

     // Simple validation checks
  if (!formData.name.trim() || !formData.breed.trim() || !formData.age || !formData.title.trim() || !formData.description.trim() || !image) {
    setMessage("Please fill out all fields and upload a picture.");
    setMessageType("error");
    return;
  }


  if (formData.age <= 0) {
    setMessage("Age must be a positive number.");
    setMessageType("error");
    return;
  }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("breed", formData.breed);
    form.append("age", formData.age);
    form.append("outdoor", formData.outdoor);
    form.append("friendly", formData.friendly);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("image", image);

    try {
      const res = await CatApi.addCat(user.username, form);
      setMessage("Cat added successfully");
      setMessageType("success");
      setFormData(INITIAL_STATE);
      setImage(null);
    } catch (err) {
      setMessage("Error adding cat");
      setMessageType("error");
      console.error("Error adding cat:", err);
    }
  };

  return (
    <div>
      {message && (
        <div className={`flash-message ${messageType}`}>
          {message}
        </div>
      )}

      
        <div className="add-cat-container">
          <form className="add-cat-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="breed">Breed:</label>
            <input
              id="breed"
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            />

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

            <button type="submit">Add Cat</button>
          </form>
        </div>
      
    </div>
  );
}

export default AppAddCat;
