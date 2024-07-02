import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../../UserContext";
import { Link } from "react-router-dom";
import CatApi from '../../../../../api';
import './userCats.css'; // Import the CSS file

function AppUserCats({ shouldShowUserCats }) {
    const { user } = useContext(UserContext);
    const [cats, setCats] = useState([]);

    useEffect(() => {
        if (user && shouldShowUserCats) {
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
    }, [user, shouldShowUserCats]);

    return (
        <div>
            {shouldShowUserCats && (
                <ul className="cats-list">
                    {cats.length > 0 ? (
                        cats.map(cat => (
                            <li key={cat.id} className="cat-item">
                                <Link to={`/cat/${cat.id}`}>
                                    <img src={cat.pictures.length > 0 ? cat.pictures[0].image_url : 'default-cat-image.jpg'} alt={cat.name} className="cat-image" />
                                    <p className="cat-name">{cat.name}</p>
                                </Link>
                            </li>
                        ))
                    ) : (
                            <p>No cats found.</p>
                        )}
                </ul>
            )}
        </div>
    );
}

export default AppUserCats;
