import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/signin.css";

function AppLogin({ authLoginInfo }) {
  const navigate = useNavigate();
  const INITIAL_STATE = {
    email: "",
    password: ""
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errorMessage, setErrorMessage] = useState("");

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
      const response = await authLoginInfo(formData);
      if (response.token) {
        localStorage.setItem('token', response.token); // Store the token
        navigate("/");
        console.log("Login successful. Navigating to '/'...");
      } else {
        setErrorMessage("No token received.");
        console.log("Login unsuccessful.");
      }
    } catch (err) {
      console.error("Error logging in", err);
      setErrorMessage("Incorrect email or password.");
      console.log("Login unsuccessful.");
    }
  };

  return (
    <div className="signInFormDiv">
      <h6>Sign In</h6>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="emailLabel">Email: </label>
        <input
          id="email"
          type="text"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label htmlFor="password" className="passwordLabel">Password: </label>
        <input
          id="password"
          type="password"  // Use password type for security
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="signinSubmitButton">Submit</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default AppLogin;
