import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Userdashbackground.css';

const Userdashbackground = () => {
  const [appointments, setAppointments] = useState([]); //management of appointment 
  const [error, setError] = useState('');
  const location = useLocation(); //useloaction for react router

  useEffect(() => { //fetching appointments by email stored 
    const userEmail = location.state?.email || '';
    if (userEmail) {
      fetchAppointments(userEmail); //fetch appointments from the users provided email address
    }
  }, [location.state]);

  const fetchAppointments = async (email) => { //fetch appointments from email used to signup with
    try {
      const response = await fetch(`http://localhost/signup.php?email=${encodeURIComponent(email)}`, { //when user signs up, email is checked within database to check if user has appt booked
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments'); //error if unable to get appointments
      }

      const responseData = await response.json();
      setAppointments(responseData.appointments || []);
      setError('');
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      setError('An unexpected error occurred while fetching appointments');
    }
  };

  const handleCancelAppointment = async (id) => { //cancellation of appointments on dashboard
    try {
      const response = await fetch('http://localhost/cancel.php', { //backend script to cancel appointments on record
        method: 'POST', //sending Post method to backend to remove the appointment
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment'); //alert user if appointment failed
      }

//debugging made by tools of GitHub source 
      setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error canceling appointment:', error.message);
      setError('An unexpected error occurred while canceling appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); //removes data 
    localStorage.removeItem('isSignedUp'); //removes signed user from system
    window.location.href = '/login'; //when using logs out then directed back to login page
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(appointment => new Date(appointment.date) > now); //showing upcoming appointments compared to current data
  const pastAppointments = appointments.filter(appointment => new Date(appointment.date) < now); //showing past appointments comparted to current date 

  return (
    <div className="userdash-background">
      <nav>
        <div className="nav">
          <div className="nav-logo">NNAILS</div>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className="nav-book"><Link to="/book">Book Here</Link></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </ul>
        </div>
      </nav>
      <div className="userdash-content">
        <h2>Upcoming Appointments</h2>
        <div className="appointments-list">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Service:</strong> {appointment.service}</p>
                <button onClick={() => handleCancelAppointment(appointment.id)} className="action-button">Cancel</button>
              </div>
            ))
          ) : (
            <p>No upcoming appointments found.</p>
          )}
          {error && <p className="error">{error}</p>}
        </div>
        <h2>Past Appointments</h2>
        <div className="appointments-list">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <p><strong>Date:</strong> {appointment.date}</p>           
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Service:</strong> {appointment.service}</p>
                {/* showing the individual date and time and service for each appointment booked */}
              </div>
            ))
          ) : (
            <p>No past appointments found.</p> //display if no appointments can be fetched by user
          )}
        </div>
      </div>
    </div>
  );
};

export default Userdashbackground;

















































