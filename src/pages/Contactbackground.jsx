import React from 'react';
import { Link } from 'react-router-dom';
import './Contactbackground.css';
import contact1Image from './contact1.jpg';
import contact2Image from './contact2.jpg';
import contact3Image from './contact3.jpg';

const Contactbackground = () => {
  return (
    <div className="contact-background">
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

      

      <div className="contact-content">
        <div className="contact-info">
          <h1>Let's Get in Touch</h1>
          <p>Whether you have a question, want to schedule an appointment, or just say hello, we're here to help. Feel free to reach out using the information below.</p>
          <div className="contact-details">
            <div>
              <i className="map-marker"></i>
              <span> Studio 24 The Quadrant B1 2PE</span>
            </div>
            <div>
              <i className="phone-alt"></i>
              <span>(+44) 7854271298</span>
            </div>
            <div>
              <i className="envelope"></i>
              <span>info@nnails.com</span>
            </div>
          </div>
          <div className="contact-image-grid">
            <img src={contact2Image} alt="Contact 2 Image" />
            <img src={contact1Image} alt="Contact Image" />
            <img src={contact3Image} alt="Contact 3 Image" />
          </div>
          <p>We look forward to hearing from you and helping you achieve the perfect nails!</p>
          <button className="book-button"><Link to="/book">Book Here</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Contactbackground;
