// LandingPageCarousel.jsx
import React, { useState, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import LandingPageCard from './LandingPageCard';
import PropTypes from 'prop-types';
import "./landingpagecarousel.css"

function LandingPageCarousel({ cards }) {
  const [index, setIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const carouselRef = useRef(null);

  const handleMouseDown = (e) => {
    setStartX(e.pageX - carouselRef.current.offsetLeft);
  };

  const handleMouseMove = (e) => {
    if (!startX) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const diff = startX - x;
    if (Math.abs(diff) > 50) {
      setIndex((prevIndex) => (diff > 0 ? prevIndex + 1 : prevIndex - 1));
      setStartX(null);
    }
  };

  const handleMouseUp = () => {
    setStartX(null);
  };
  

  const handleSelect = (selectedIndex) => {
    // Calculate the next index based on the direction of the slide
    const direction = selectedIndex > index ? 1 : -1;
    let newIndex = index + direction;

    // Check if the new index exceeds the bounds
    if (newIndex < 0 || newIndex >= cards.length) {
        // Loop back to the beginning or end
        newIndex = newIndex < 0 ? cards.length - 1 : 0;
    }

    setIndex(newIndex);
    console.log("Selected Index:", selectedIndex);
};


  return (
    <div
      className="landing-page-carousel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={carouselRef}
    >
      <Carousel 
        activeIndex={index} 
        onSelect={(selectedIndex) => handleSelect(selectedIndex)}
        interval={null} 
        indicators={false} 
        controls={false}
      >
        {cards.map((cardGroup, i) => (
          <Carousel.Item key={i}>
            <div className="d-flex justify-content-around">
              {cardGroup.map((item, j) => (
                <LandingPageCard key={j} title={item.title} text={item.text} />
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}



export default LandingPageCarousel;