import React from 'react';
import { Link } from 'react-router-dom'; 
import './Hero.css';

import pauseIcon from '../../assets/pause_icon.png';
import playIcon from '../../assets/play_icon.png';

const Hero = ({ heroData, setHeroCount, heroCount, setPlayStatus, playStatus }) => {
  const handleDotClick = (index) => {
    setHeroCount(index);
  };

  const handlePlayPauseClick = () => {
    setPlayStatus(!playStatus);
  };

  return (
    <div className='hero'>
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          {[0, 1, 2].map((index) => (
            <li
              key={index}
              onClick={() => handleDotClick(index)}
              className={heroCount === index ? "hero-dot orange" : "hero-dot"}
            ></li>
          ))}
        </ul>
        <div className="hero-play">
          <img
            onClick={handlePlayPauseClick}
            src={playStatus ? pauseIcon : playIcon}
            alt={playStatus ? "Pause" : "Play"}
          />
          <p>Press video</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

//Sources
//https://www.youtube.com/watch?v=aKByHmd6unc

