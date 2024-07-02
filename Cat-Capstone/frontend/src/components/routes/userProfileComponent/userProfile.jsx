import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../../UserContext";
import { useNavigate } from "react-router-dom";
import CatApi from '../../../../../api';
import './userProfile.css'; 

function AppProfile({ shouldShowPatch }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const INITIAL_STATE = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("");

    const updateProfile = async (data) => {
        try {
            const res = await CatApi.patchUser(user.username, data);
            setMessage("Update successful");
            setMessageType("success");
            console.log("Response from server:", res);
            return res;
        } catch (err) {
            setMessage("Error updating profile");
            setMessageType("error");
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
        } catch (err) {
            console.error("Error updating profile", err);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            {message && (
                <div className={`flash-message ${messageType}`}>
                    {message}
                </div>
            )}

            {shouldShowPatch && (
                <div className="profile-container">
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

                        <button type="submit">Submit</button>
                    </form>
                    <button onClick={() => navigate('/userCats')}>Edit Cats</button> {/* New Button */}
                </div>
            )}
        </div>
    );
}

export default AppProfile;
