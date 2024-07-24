import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../UserContext";
import { Link } from "react-router-dom";
import CatApi from '../../../../../api';
import './userCats.css'; // Import the CSS file

function AppUserCats() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [cats, setCats] = useState([]);
    console.log(cats)

    useEffect(() => {
        if (user) {
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
    }, [user]);

    return (
        <div>
            
                <ul className="cats-list">
                    {cats.length > 0 ? (
                        cats.map(cat => (
                            <li key={cat.id} className="cat-item">
                                <Link to={`/cats/${cat.id}/update`}>
                                    <img src={cat.pictures.length > 0 ? cat.pictures[0].image_url : 'default-cat-image.jpg'} alt={cat.name} className="cat-image" />
                                    <p className="cat-name">{cat.name}</p>
                                    
                                </Link>
                                <p>Breed: {cat.breed}</p>
                                <p>Age: {cat.age}</p>
                                <p>Description: {cat.pictures[0].description}</p>
                            </li>
                        ))
                    ) : (
                            <p>No cats found.</p>
                        )}
                </ul>
                <button onClick={() => navigate('/addCat')}>Add Cats</button>
        </div>
    );
}

export default AppUserCats;
