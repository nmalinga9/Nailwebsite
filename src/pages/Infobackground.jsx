import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Infobackground.css';

const Infobackground = () => {
  const navigate = useNavigate();//source //https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedService = params.get('selectedService');
  const selectedDate = params.get('selectedDate');
  const selectedTime = params.get('selectedTime');
  const selectedAddons = params.get('selectedAddons') ? params.get('selectedAddons').split(',') : [];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => {
        if (checked) {
          return {
            ...prevData,
            addons: [...prevData.addons, value],
          };
        } else {
          return {
            ...prevData,
            addons: prevData.addons.filter((addon) => addon !== value),
          };
        }
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const formatDate = (date) => {
    const parts = date.split(' ');
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const formattedDate = `${parts[3]}-${months[parts[1]]}-${parts[2]}`;
    return formattedDate;
  };
  
  //https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = formatDate(selectedDate); // Format the date here
    const formDataWithDateTime = {
      ...formData,
      selectedDate: formattedDate, // Use the formatted date
      selectedTime,
      selectedService,
    };

    console.log('Selected Date:', selectedDate);

    fetch('http://localhost/submit_form.php', {
      method: 'POST',
      body: JSON.stringify(formDataWithDateTime),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      return response.json(); // Pass response as JSON
    })
    .then(data => {
      console.log(data);
      if (data.success) {
        setConfirmation('Form submitted successfully');
        navigate(`/confirmation?selectedService=${encodeURIComponent(selectedService)}&selectedDate=${encodeURIComponent(selectedDate)}&selectedTime=${encodeURIComponent(selectedTime)}&email=${encodeURIComponent(formData.email)}`);
      } else {
        setError('Failed to submit form');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Failed to submit form');
    });
  };

  return (
    <div className="info-background">
      <div className="back-button">
        <button onClick={() => window.history.back()}>Back to services</button>
      </div>
      <nav>
        <div className='nav'>
          <div className="nav-logo">NNAILS</div>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className='nav-book'><Link to="/book">Book Here</Link></li>
          </ul>
        </div>
      </nav>
      <div className="info-content-container">
        <div className="info-content">
          <h3>Booking Details</h3>
          <h2>Service: {selectedService}</h2>
          <h2>Date: {selectedDate}</h2>
          <h2>Time: {selectedTime}</h2>
          {selectedAddons.length > 0 && (
            <div>
              <h3>Add-ons:</h3>
              <ul className="addons-list">
                {selectedAddons.map((addon, index) => (  //if had time to develop add-ons
                  <li key={index}>+ {addon}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Form inputs */}
            <div>
              <label htmlFor="firstName">First Name:</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="phone">Phone:</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <button type="submit">Submit</button>
            {error && <div className="error">{error}</div>}
            {confirmation && <div className="confirmation">{confirmation}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Infobackground;




















