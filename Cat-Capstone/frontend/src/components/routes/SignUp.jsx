import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/signup.css';
import CatYogaImage from '../../assets/cat-yoga.png';

function AppSignUp({ signUp }) {
  const INITIAL_STATE = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: ''
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({ ...formData });
      navigate('/login');
      console.log('signup successful. Navigating to "/login"...');
    } catch (err) {
      console.error('Error signing up', err);
      console.log('signup unsuccessful.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-image">
        <img src={CatYogaImage} alt="yoga cats" />
      </div>
      <div className="signUpFormDiv">
        <h1>Join Whiskurr today</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="usernameLabel">Username: </label>
          
          <input
            id="username"
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
          />
          <br/>
          <label htmlFor="password" className="passwordLabel">Password: </label>
          
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br/>
          <label htmlFor="first_name" className="firstNameLabel">First Name: </label>
          
          <input
            id="first_name"
            type="text"
            name="first_name"
            placeholder="first name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <br/>
          <label htmlFor="last_name" className="lastNameLabel">Last Name: </label>
          
          <input
            id="last_name"
            type="text"
            name="last_name"
            placeholder="last name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <br/>
          <label htmlFor="email" className="emailLabel">Email: </label>
          
          <input
            id="email"
            type="text"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br/>
          <button className="signupSubmitButton">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AppSignUp;
