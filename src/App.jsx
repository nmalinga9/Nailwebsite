import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Background from "./Components/Background/Background";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Info from "./pages/Info";
import Book from "./pages/Book";
import Confirmation from "./pages/Confirmation";
import Admin from "./pages/Admin";
import Admindash from "./pages/Admindash";
import User from "./pages/User";
import Userdash from "./pages/Userdash";
import Login from "./pages/Login";
import Logindash from "./pages/Logindash";
// allowing access to all pages 

const App = () => {
  const heroData = [
    { text1: "Book with us", text2: "today" }, //text on homescreen
    { text1: "Try a new", text2: "nail design" },
    { text1: "Explore", text2: "our designs" },
  ];
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false); //play of video

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeroCount((count) => (count === 2 ? 0 : count + 1));
    }, 3000); //automatic hero scrren count
    //source taken from Youtube Video 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Book />} />
          <Route path="/info" element={<Info />} />
          <Route path="/confirmation" element={<Confirmation/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/admindash" element={<Admindash/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/userdash" element={<Userdash/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/logindash" element={<Logindash/>} />
          
        </Routes>
        {/* route paths to allow navigation between all pages through react router */}
        <Background playStatus={playStatus} heroCount={heroCount} />
        <Hero
          setPlayStatus={setPlayStatus}
          heroData={heroData[heroCount]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          playStatus={playStatus}
        />
      </div>
    </Router>
  );
};

export default App;




