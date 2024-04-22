import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Loginbackground.css';

const Loginbackground = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }
//Source/Reference help - https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
      setError('');
      const appointments = await fetchAppointments(email);
      navigate(`/logindash?email=${encodeURIComponent(email)}`, { state: { appointments } });
    } catch (error) {
      console.error('Error:', error.message);
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const fetchAppointments = async (email) => {
    try {
      const response = await fetch(`http://localhost/login.php?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const responseData = await response.json();

      if (!responseData || !responseData.appointments) {
        throw new Error('No appointments found');
      }

      console.log('Appointments:', responseData.appointments);
      return responseData.appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      setError(error.message || 'An unexpected error occurred while fetching appointments');
      return null;
    }
  };

  //https://web.dev/articles/fetch-api-error-handling

  return (
    <div className="login-background">
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
      <div className="login-container"> {/* Updated class name */}
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button> 
          {/* loading button for loggin  */}
        </form>
      </div>
    </div>
  );
};

export default Loginbackground;









