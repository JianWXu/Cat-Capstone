// AppLandingPage.jsx
import React from 'react';
import CatPileLady from '../../../assets/catpile-woman.png';
import LandingPageCarousel from './LandingPageCarousel';
import '../../../css/landingpage.css';

function AppLandingPage({ shouldShowLanding }) {

  const cards = [
    [
      { title: 'Jessica and Tinker', text: 'I love this app so much and have been using it a lot. I met so many people and so many great cats!' }, 
      { title: 'David and Molly', text: 'I found my human bff and my cat has a new friend to wrestle with.' }, 
      { title: 'Jenny and Luna', text: 'We just moved to a new city and it\'s hard to meet people. I am so happy with the app!' },    
      { title: 'Sam and Bob', text: 'Highly recommend!' }, 
      { title: 'Kevin and the Menance', text: 'We don\'t need the dog park! We have Whiskurr!' }, 
      { title: 'Audrey and Cat', text: 'This app gives me an excuse to walk my cat.' }
    ]
  ];


  return (
    <div>
      {shouldShowLanding && (
        <>
          <div className="first-container">
            <div className="first-container-heading">
              <h2>Whiskurr</h2>
              <br />
              <h1>Helping you find your furry master's new BFF.</h1>
            </div>
            <div className="first-container-image">
              <img src={CatPileLady} alt="pile of cats" />
            </div>
          </div>

          <div className="second-container">
            <LandingPageCarousel
              cards={cards}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AppLandingPage;
