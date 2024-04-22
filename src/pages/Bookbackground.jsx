
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Bookbackground.css';
import biabFullSetImage from './biabfullset.jpg';
import biabInfillImage from './biabinfill.jpg';
import plainacrylicImage from './plainacrylic.jpg';
import frenchtipImage from './frenchtipset.jpg';
import ombresetImage from './ombreset.jpg';
import customsetImage from './customset.jpg';
import chromesetImage from './chromeset.jpg';
import acrylictoesImage from './acrylictoes.jpg';
import frenchtiptoesImage from './frenchtiptoes.jpg';
import toesandhandsImage from './toesandhands.jpg';
import toesandhands1Image from './toesandhands1.jpg';

const Bookbackground = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState({});
  const [showBookButton, setShowBookButton] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedFilters] = useState([]);


  const toggleDropdown = (serviceId) => {
    setShowDropdown((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
    setShowBookButton(false);
  };

  const handleViewAllAppointments = () => {
    setShowDropdown({});
    setShowBookButton(true);
  };

  const handleDateChange = (date) => {
    const currentDate = new Date();
    // Check if selected date is before the current date
    if (date < currentDate) {
      
      alert("Please select a date in the future."); //receive error
    } else {
      setSelectedDate(date);
      fetchAvailableTimes(formatDate(date));
    }
  };
  

  // format the date to YYYY-MM-DD
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };


  const fetchAvailableTimes = (formattedDate) => {

    fetch(`http://localhost/populate_available_times.php?selectedDate=${formattedDate}`)
      .then(response => response.json())
      .then(data => {
        setAvailableTimes(data.availableTimes);
      })
      .catch(error => console.error('Error fetching available times:', error));
  };
// fetching available times
  


  const handleSelectAndContinue = (time, service) => {
    setSelectedTime(time);
    setSelectedService(service);
    setAvailableTimes((prevTimes) => prevTimes.filter((prevTime) => prevTime !== time));
    updateAvailabilityStatus(selectedDate, time);
    navigate(`/info?selectedDate=${encodeURIComponent(selectedDate)}&selectedTime=${encodeURIComponent(time)}&selectedService=${encodeURIComponent(service)}&selectedAddons=${encodeURIComponent(selectedAddons.join(','))}`);
  };

  const updateAvailabilityStatus = (date, time) => {
    fetch(`http://localhost/populate_available_times.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, time }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update availability status');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log('Availability status updated successfully.');
          fetchAvailableTimes(date); // Fetch available times again after updating
        } else {
          console.error('Failed to update availability status:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error updating availability status:', error);
      });
  };




  return (
    <div className="book-background">
      <nav>
        <div className="nav">
          <div className="nav-logo">NNAILS</div>
          <ul className="nav-menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li className="nav-book">
              <Link to="/book">Book Here</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="admin-access">
        <Link to="/admin">Admin Access</Link>
      </div>
      <div className="login-access">
        <button onClick={() => navigate('/login')}>Returning? Login</button>
      </div>
      {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
      <div className="service-box">
        <h3>BIAB Services</h3>
        <ul>
          <li>
            <div className="service">
            <img src={biabFullSetImage} alt="BIAB Full Set" width="200" height="100" />
              <h4>BIAB Full Set</h4>
              <p>1 hour 10minutes @£35</p>
              {showBookButton && (
                <button onClick={() => toggleDropdown('biab-full-set')}>Book</button>
              )}
              {showDropdown['biab-full-set'] && (
                <div className="dropdown">
                  <div className="dropdown-content">
                    <div className="options-container">
                     
        
                    </div>
                    <div className="calendar-container">
                      <div className="calendar">
                        <label>Select Date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                      </div>
                      <div className="appointment-times">
                        <p>Available Appointment Times:</p>
                        <div className="appointment-button-container">
                          {availableTimes.map((time) => (
                            <div key={time} className="appointment-button-wrapper">
                              <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'BIAB Full Set')}>
                                {time}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
            {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
          </li>
          <li>
            <div className="service">
            <img src={biabInfillImage} alt="BIAB Infill Set" width="200" height="100" />
              <h4>BIAB Infill Set</h4>
              <p>1 hour @£25</p>
              {showBookButton && (
                <button onClick={() => toggleDropdown('biab-infill-set')}>Book</button>
              )}
              {showDropdown['biab-infill-set'] && (
                <div className="dropdown">
                  <div className="dropdown-content">
                    <div className="options-container">
                      
                    </div>
                    <div className="calendar-container">
                      <div className="calendar">
                        <label>Select Date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                      </div>
                      <div className="appointment-times">
                        <p>Available Appointment Times:</p>
                        <div className="appointment-button-container">
                          {availableTimes.map((time) => (
                            <div key={time} className="appointment-button-wrapper">
                              <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'BIAB Infill Set')}>
                                {time}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>

     
      <div className="service-box">
        <h3>Regular Hand Services</h3>
        <ul>
        {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
          <li>
            <div className="service">
            <img src={plainacrylicImage} alt="Plain Acrylic" width="200" height="100" />
              <h4>Plain Acrylic Full Set</h4>
              <p>1 hour 25 minutes  @£40 </p>
              {showBookButton && (
                <button onClick={() => toggleDropdown('plain-acrylic-full-set')}>Book</button>
              )}
              {showDropdown['plain-acrylic-full-set'] && (
                <div className="dropdown">
                  <div className="dropdown-content">
                    <div className="options-container">
                      
                    </div>
                    <div className="calendar-container">
                      <div className="calendar">
                        <label>Select Date:</label>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} />
                      </div>
                      <div className="appointment-times">
                        <p>Available Appointment Times:</p>
                        <div className="appointment-button-container">
                          {availableTimes.map((time) => (
                            <div key={time} className="appointment-button-wrapper">
                              <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Plain Acrylic Full Set')}>
                                {time}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
          {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}         
      {/* button to view all appointments^^ */}
          <li>
  <div className="service">
  <img src={frenchtipImage} alt="FrenchTip Set" width="200" height="100" />
    <h4>French Tip Set</h4>
    <p>1 hour 40 minutes @£45</p>
    {showBookButton && (
      <button onClick={() => toggleDropdown('french-tip-set')}>Book</button>
    )}
    {showDropdown['french-tip-set'] && (
      <div className="dropdown">
        <div className="dropdown-content">
          <div className="options-container">
          
          </div>
          <div className="calendar-container">
            <div className="calendar">
              <label>Select Date:</label>
              <DatePicker selected={selectedDate} onChange={handleDateChange} />
            </div>
            <div className="appointment-times">
              <p>Available Appointment Times:</p>
              <div className="appointment-button-container">
                {availableTimes.map((time) => (
                  <div key={time} className="appointment-button-wrapper">
                    <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'French Tip Set')}>
                      {time}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</li>
{!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
<li>
  <div className="service">
  <img src={ombresetImage} alt="Ombre Set" width="200" height="100" />
    <h4>Ombre Set</h4>
    <p>1 hour 45 minutes @£50</p>
    {showBookButton && (
      <button onClick={() => toggleDropdown('ombre-set')}>Book</button>
    )}
    {showDropdown['ombre-set'] && (
      <div className="dropdown">
        <div className="dropdown-content">
          <div className="options-container">
            
          </div>
          <div className="calendar-container">
            <div className="calendar">
              <label>Select Date:</label>
              <DatePicker selected={selectedDate} onChange={handleDateChange} />
            </div>
            <div className="appointment-times">
              <p>Available Appointment Times:</p>
              <div className="appointment-button-container">
                {availableTimes.map((time) => (
                  <div key={time} className="appointment-button-wrapper">
                    <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Ombre Set')}>
                      {time}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</li>
{!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
<li>
  <div className="service">
  <img src={customsetImage} alt="Custom Set" width="200" height="100" />
    <h4>Custom Set</h4>
    <p>1 hour 55 minutes @£55</p>
    {showBookButton && (
      <button onClick={() => toggleDropdown('custom-set')}>Book</button>
    )}
    {showDropdown['custom-set'] && (
      <div className="dropdown">
        <div className="dropdown-content">
          <div className="options-container">
          
          </div>
          <div className="calendar-container">
            <div className="calendar">
              <label>Select Date:</label>
              <DatePicker selected={selectedDate} onChange={handleDateChange} />
            </div>
            <div className="appointment-times">
              <p>Available Appointment Times:</p>
              <div className="appointment-button-container">
                {availableTimes.map((time) => (
                  <div key={time} className="appointment-button-wrapper">
                    <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Custom Set')}>
                      {time}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</li>
{!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
<li>
  <div className="service">
  <img src={chromesetImage} alt="Chrome Set" width="200" height="100" />
    <h4>Chrome Set</h4>
    <p>1 hour 40 minutes @£50</p>
    {showBookButton && (
      <button onClick={() => toggleDropdown('chrome-set')}>Book</button>
    )}
    {showDropdown['chrome-set'] && (
      <div className="dropdown">
        <div className="dropdown-content">
          <div className="options-container">
          
          </div>
          <div className="calendar-container">
            <div className="calendar">
              <label>Select Date:</label>
              <DatePicker selected={selectedDate} onChange={handleDateChange} />
            </div>
            <div className="appointment-times">
              <p>Available Appointment Times:</p>
              <div className="appointment-button-container">
                {availableTimes.map((time) => (
                  <div key={time} className="appointment-button-wrapper">
                    <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Chrome Set')}>
                      {time}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</li>

<div className="service-box">
  <h3>Toe Services</h3>
  <ul>
    <li>
    {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
      <div className="service">
      <img src={acrylictoesImage} alt="Acrylic Toes" width="200" height="100" />
        <h4>Acrylic Toes Plain </h4>
        <p>1 hour @£25</p>
        {showBookButton && (
          <button onClick={() => toggleDropdown('Acrylic Toes')}>Book</button>
        )}
        {showDropdown['Acrylic Toes'] && (
          <div className="dropdown">
            <div className="dropdown-content">
              <div className="options-container">
                
              </div>
              <div className="calendar-container">
                <div className="calendar">
                  <label>Select Date:</label>
                  <DatePicker selected={selectedDate} onChange={handleDateChange} />
                </div>
                <div className="appointment-times">
                  <p>Available Appointment Times:</p>
                  <div className="appointment-button-container">
                    {availableTimes.map((time) => (
                      <div key={time} className="appointment-button-wrapper">
                        <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Acrylic Toes Plain')}>
                          {time}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
    {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
    <li>
      <div className="service">
      <img src={frenchtiptoesImage} alt="Frenchtiptoes" width="200" height="100" />
        <h4>Acrylic Toes French Tip</h4>
        <p>1 hour @£30</p>
        {showBookButton && (
          <button onClick={() => toggleDropdown('Acrylic Toes French Tip')}>Book</button>
        )}
        {showDropdown['Acrylic Toes French Tip'] && (
          <div className="dropdown">
            <div className="dropdown-content">
              <div className="options-container">
                
              </div>
              <div className="calendar-container">
                <div className="calendar">
                  <label>Select Date:</label>
                  <DatePicker selected={selectedDate} onChange={handleDateChange} />
                </div>
                <div className="appointment-times">
                  <p>Available Appointment Times:</p>
                  <div className="appointment-button-container">
                    {availableTimes.map((time) => (
                      <div key={time} className="appointment-button-wrapper">
                        <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Acrylic Toes Plain')}>
                          {time}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  </ul>
</div>

<div className="service-box">
  <h3>Hands and Feet Services</h3>
  <ul>
  {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
    <li>
      <div className="service">
      <img src={toesandhands1Image} alt="Normal Toes and Hands" width="200" height="100" />
        <h4>Plain Acrylic Full Set + Plain Colour Toes</h4>
        <p>1 hour 50 minutes @£65</p>
        {showBookButton && (
          <button onClick={() => toggleDropdown('Plain Acrylic Full Set + Plain Colour Toes')}>Book</button>
        )}
        {showDropdown['Plain Acrylic Full Set + Plain Colour Toes'] && (
          <div className="dropdown">
            <div className="dropdown-content">
              <div className="options-container">
           
              </div>
              <div className="calendar-container">
                <div className="calendar">
                  <label>Select Date:</label>
                  <DatePicker selected={selectedDate} onChange={handleDateChange} />
                  <input type="date" onChange={handleDateChange} />
                </div>
                <div className="appointment-times">
                  <p>Available Appointment Times:</p>
                  <div className="appointment-button-container">
                    {availableTimes.map((time) => (
                      <div key={time} className="appointment-button-wrapper">
                        <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'Plain Acrylic Full Set + Plain Colour Toes')}>
                          {time}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
    {!showBookButton && (
        <button onClick={handleViewAllAppointments}>View All Services</button>
      )}
    <li>
      <div className="service">
      <img src={toesandhandsImage} alt="French Tip Toes and Hands" width="200" height="100" />
        <h4>French Tip Set + French Tip Toes</h4>
        <p> 2 hours @£70</p>
        {showBookButton && (
          <button onClick={() => toggleDropdown('French Tip Set + French Tip Toes')}>Book</button>
        )}
        {showDropdown['French Tip Set + French Tip Toes'] && (
          <div className="dropdown">
            <div className="dropdown-content">
              <div className="options-container">
              </div>
              <div className="calendar-container">
                <div className="calendar">
                  <label>Select Date:</label>
                  <DatePicker selected={selectedDate} onChange={handleDateChange} />
                  <input type="date" onChange={handleDateChange} />
                </div>
                <div className="appointment-times">
                  <p>Available Appointment Times:</p>
                  <div className="appointment-button-container">
                    {availableTimes.map((time) => (
                      <div key={time} className="appointment-button-wrapper">
                        <button className="appointment-button" onClick={() => handleSelectAndContinue(time, 'French Tip Set + French Tip Toes')}>
                          {time}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  </ul>
</div>


        </ul>
      </div>
    </div>
  );
};

export default Bookbackground;













































