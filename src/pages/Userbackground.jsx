import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Userbackground.css';

const Userbackground = () => {
  const [email, setEmail] = useState(''); //signup email reqired
  const [password, setPassword] = useState(''); //signup password required
  const [error, setError] = useState(''); //alert if error written
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();  //navigate to dashbaord after successful signup

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address'); //alert user to insert correct email of user that has booked 
      return;
    }

    try {
      const response = await fetch('http://localhost/signup.php', {
        method: 'POST', //post request to backend script with users password an demail 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), //email and password utilised
      });

      if (!response.ok) {
        throw new Error('Failed to sign up'); //alert if failed to sign up code 
      }

      const responseData = await response.json();

      if (!responseData || !responseData.success) {
        throw new Error(responseData.error || 'Sign up failed');
      }

      setSuccess(responseData.success);  
      setError('');

      // Redirect to user dashboard with email
      navigate('/userdash', { state: { email } });

    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message || 'An unexpected error occurred');
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }; //source from Github to make sure email follows email format 

  return (
    <div className="user-background">
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
      <div className="user-content">
        <div className="signup-form">
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Userbackground;



































