import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LandingPageCard from "./LandingPageCard";
import "./landingpagecarousel.css"

function LandingPageCarousel({ cards }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,  // Ensure each slide adapts to the height of its content
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
    <div className="landing-page-carousel">
      <Slider {...settings}>
        {cards.map((cardGroup, i) => (
          <div key={i} className="d-flex justify-content-around">
            {cardGroup.map((item, j) => (
              <LandingPageCard key={j} title={item.title} text={item.text} />
            ))}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default LandingPageCarousel;
