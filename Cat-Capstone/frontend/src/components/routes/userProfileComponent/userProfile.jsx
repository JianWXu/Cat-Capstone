import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../../userContext";
import { useNavigate } from "react-router-dom";
import CatApi from '../../../../../api';
import './userProfile.css'; 

function AppProfile({ shouldShowPatch }) {
    const { user } = useContext(UserContext);
    const userObj = JSON.parse(user);
    const navigate = useNavigate();

    const INITIAL_STATE = {
        first_name: userObj.first_name,
        last_name: userObj.last_name,
        email: userObj.email,
        password: '*' // Initial state for password
    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("");

    const updateProfile = async (data) => {
        try {
            const res = await CatApi.patchUser(userObj.username, data);
            return res;
        } catch (err) {
            console.error("Error updating user", err);
            throw err;
        }
    };

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
            await updateProfile(formData);
            setMessage("Update successful");
            setMessageType("success");
        } catch (err) {
            console.error("Error updating profile", err);
            setMessage(err.message);
            setMessageType("error");
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="profile-container">
            {shouldShowPatch && (
                <>
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <label htmlFor="first_name">First Name:</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label htmlFor="last_name">Last Name:</label>
                        <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={Array(formData.password.length + 1).join('*')}
                            onChange={handleChange}
                        />

                        <button type="submit">Submit</button>
                    </form>

                    {message && <div className={`message ${messageType}`}>{message}</div>}
                </>
            )}
        </div>
    );
}

export default AppProfile;
