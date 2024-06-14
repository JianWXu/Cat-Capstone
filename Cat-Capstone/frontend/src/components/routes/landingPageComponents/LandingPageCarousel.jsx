import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LandingPageCard from "./LandingPageCard";
import "./landingpagecarousel.css";

function LandingPageCarousel({ cards }) {
  const [maxHeight, setMaxHeight] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    // Calculate the height of the tallest card
    const heights = cardRefs.current.map(ref => ref?.offsetHeight || 0);
    const max = Math.max(...heights);
    setMaxHeight(max);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="landing-page-carousel" style={{ height: maxHeight }}>
      <Slider {...settings}>
        {cards.flat().map((item, i) => (
          <div key={i} className="carousel-card" ref={el => cardRefs.current[i] = el}>
            <LandingPageCard title={item.title} text={item.text} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default LandingPageCarousel;
