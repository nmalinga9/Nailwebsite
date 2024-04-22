import React from 'react';
import { Link } from 'react-router-dom';
import './Aboutbackground.css';
import nailsalonImage from './nailsalon.jpg';

const Aboutbackground = () => {
  return (
    <div className="about-background">
      <nav>
        <div className="nav">
          <div className="nav-logo">NNAILS</div>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className="nav-book"><Link to="/book">Book Here</Link></li>
          </ul>
        </div>
      </nav>

      <div className="about-content">
        <div className="about-image">
          <img src={nailsalonImage} alt="Nail Salon" />
        </div>
        <div className="about-text">
          <h1>Welcome to NNails</h1>
          <p>
            At NNails, we are passionate about providing our clients with exceptional nail care services. 
            <div>Book our team of experienced and skilled nail technicians who have all Nail qualifications needed to assist.</div>
          </p> 
{/* Summary of more information about the nail technicians qualifications and experience above */}
          <h2>Studio Policies</h2>
          <p>We kindly request that you come product free.</p>
          <p>We are open from 9am to 7pm, Monday to Saturday.</p>
          {/* necessary studio polices customers to follow */}
          <h2>Cancellation Policies</h2>
          <p>If you cancel your appointment within less than 24 hours notice or fail to show up for your scheduled appointment you will be banned from booking in the future.</p>
          {/* cancellation polices to follow */}
          <h2>Late Policies</h2>
          <p>There is a grace period of 15 minutes, any arrival after this will incur a £15 late fee. After the grace period, your appointment will be cancelled.</p>
          {/* late polcies to follow */}
          <button className="book-button"><Link to="/book">Book Now</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Aboutbackground;











