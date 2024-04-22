import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Logindashbackground.css';

const Logindashbackground = () => {
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const localAppointments = localStorage.getItem('appointments');
    if (localAppointments) {
      setAppointments(JSON.parse(localAppointments)); //json response
    } else if (location.state && location.state.appointments) {
      setAppointments(location.state.appointments);
    } else {
      fetchAppointments();
    }
  }, [location.state]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost/login.php?email=${encodeURIComponent(localStorage.getItem('userEmail'))}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const responseData = await response.json();
      setAppointments(responseData.appointments || []);
      setError('');
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      setError('An unexpected error occurred while fetching appointments');
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      console.log("Canceling appointment with id:", id);
      const response = await fetch('http://localhost/cancel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      // Remove the canceled appointment from the appointments list
      setAppointments(prevAppointments => {
        const updatedAppointments = prevAppointments.filter(appointment => appointment.id !== id);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        return updatedAppointments;
      });
    } catch (error) {
      console.error('Error canceling appointment:', error.message);
      setError('An unexpected error occurred while canceling appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isSignedUp');
    localStorage.removeItem('appointments'); // Clear appointments on logout
    window.location.href = '/login';
  };

  // Filter appointments into upcoming and past
  const now = new Date();
  const upcomingAppointments = appointments.filter(appointment => new Date(appointment.date) > now);
  const pastAppointments = appointments.filter(appointment => new Date(appointment.date) < now);

  return (
    <div className="logindash-background">
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
      <div className="logindash-content">
        <h2>Upcoming Appointments</h2>
        <div className="appointments-list">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Service:</strong> {appointment.service}</p>
                <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
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
              </div>
            ))
          ) : (
            <p>No past appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logindashbackground;

//Source help/Reference from - https://www.geeksforgeeks.org/appointment-management-system-using-react/
















