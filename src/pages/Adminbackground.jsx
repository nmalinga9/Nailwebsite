import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Adminbackground.css';

const Adminbackground = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/submit_admin.php', { //pathway to link path of php script
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json(); //return as json response
      if (data.success) {
        
        navigate('/admindash'); //if successful user is directed to admin dashboard
      } else {
        
        setError(data.message); //  display error message if login failed
      }
    } catch (error) {   // Handle any network or server errors
      
      console.error('Error:', error);
      setError('Failed to authenticate. Please try again.');
    }
  };
 
  //following code for the basics of each webpage
  return (
    <div className="admin-background">
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
      <div className="login-container">
        <h2>Admin Login</h2>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <button type="submit">Login</button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Adminbackground;





