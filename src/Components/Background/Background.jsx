import React from 'react';
import './Background.css';

import video1 from '../../assets/video1.mp4';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.png';

const Background = ({ playStatus, heroCount }) => {
  let backgroundContent;

  if (playStatus) {
    backgroundContent = <video className='background fade-in' autoPlay loop muted>
      <source src={video1} type='video/mp4' />
    </video>;
  } else {
    switch (heroCount) {
      case 0:
        backgroundContent = <img src={image1} className='background fade-in' alt="" />;
        break;
      case 1:
        backgroundContent = <img src={image2} className='background fade-in' alt="" />;
        break;
      case 2:
        backgroundContent = <img src={image3} className='background fade-in' alt="" />;
        break;
      default:
        backgroundContent = null;
        break;
    }
  }

  return backgroundContent;
};

export default Background;

//Sources
//https://www.youtube.com/watch?v=aKByHmd6unc