import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className='nav'>
      <div className="nav-logo">NNAILS</div>
      <ul className="nav-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li className='nav-book'><Link to="/book">Book Here</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;


//Sources
//https://www.youtube.com/watch?v=aKByHmd6unc