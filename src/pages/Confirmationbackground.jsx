import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Confirmationbackground.css';

const Confirmationbackground = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const selectedService = new URLSearchParams(location.search).get('selectedService');
  const selectedDate = new URLSearchParams(location.search).get('selectedDate');
  const selectedTime = new URLSearchParams(location.search).get('selectedTime');

  const handleBookAnotherAppointment = () => {
    // Redirect to the booking page
    window.location.href = "/book";
  };

  useEffect(() => {
    
    const response = {
      success: true,
      message: "Thank you for booking with us today!"
    };

    if (response.success) {
      setConfirmationMessage(response.message);
    } else {
      setConfirmationMessage("Booking failed. Please try again.");
    }
  }, []);

  return (
    <div className="confirmation-background">
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

      <div className="admin-access">
        <Link to="/admin">Admin Access</Link>
      </div>
      <div className="login-access">
      <button onClick={() => navigate('/login')}>Returning? Login</button>
      </div>
     
      {/* added login and admin access */}

      <div className="confirmation-container">
        <h2 className="confirmation-heading">Booking Confirmation</h2>
        {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
        <div className="booking-details">
          <h3>Appointment Details</h3>
          <p><span className="label">Service:</span> {selectedService}</p> 
          <p><span className="label">Date:</span> {selectedDate}</p>
          <p><span className="label">Time:</span> {selectedTime}</p>
          {/* customers details when booking finalised */}
        </div>
        <div className="booking-buttons">
          <button className="book-button"><Link to="/book">Book Another Appointment</Link></button>
          <button className="book-button"><Link to="/user">Register an Account</Link></button>
          
        </div>
      </div>
    </div>
  );
};

export default Confirmationbackground;













