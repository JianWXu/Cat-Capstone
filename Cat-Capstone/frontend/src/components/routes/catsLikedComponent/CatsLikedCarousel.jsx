import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CatsLikedCard from './CatsLikedCard';
import './catslikedcarousel.css';

function CatsLikedCarousel({ cards, getMutualLikes }) {
  const [mutualLikes, setMutualLikes] = useState([]);
  const [settings, setSettings] = useState({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true,
    draggable: true, // Enable dragging by default
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });

  useEffect(() => {
    // Fetch mutual likes
    const fetchMutualLikes = async () => {
      try {
        const likes = await getMutualLikes();
        setMutualLikes(likes);
      } catch (error) {
        console.error("Error fetching mutual likes:", error);
      }
    };

    fetchMutualLikes();
  }, [getMutualLikes]);

  useEffect(() => {
    // Adjust settings based on number of cards
    if (cards.length < 5) {
      setSettings(prevSettings => ({
        ...prevSettings,
        infinite: false, // Disable infinite scrolling
        draggable: false, // Disable dragging
      }));
    } else {
      setSettings(prevSettings => ({
        ...prevSettings,
        infinite: true, // Enable infinite scrolling
        draggable: true, // Enable dragging
      }));
    }
  }, [cards.length]);

  return (
    <div className="cats-liked-carousel">
      <Slider {...settings}>
        {cards.map((item, i) => (
          <div key={i} className="carousel-card">
            <CatsLikedCard
              name={item.name}
              image={item.image_url}
              species={item.species}
              friendly={item.friendly}
              age={item.age}
              outdoor={item.outdoor}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CatsLikedCarousel;
