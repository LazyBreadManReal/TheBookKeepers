import React, { useEffect, useState } from "react";
import "../assets/css/NavBar.css"



const NavBar: React.FC = () => {
  return (
    <div className="navbar">
      <div className="logo-moto-section">
        <img src="/src/assets/images/logowhite.png" alt="" className="logo"/>
        <h2>PAVE YOUR PATH <br />AS WE TRACK THE MATH</h2>
      </div>
      <h1><a href="http://localhost:5173/">THE BOOKKEEPER</a></h1>
      <div className="about-us-section">
        <div className="about-us">
          <h2><a href="http://localhost:5173/aboutus">ABOUT US</a></h2>
        </div>
        <div className="socials">
          <img src="/src/assets/images/icons/facebook-white.png" alt="" />
          <img src="/src/assets/images/icons/twitter.png" alt="" />
          <img src="/src/assets/images/icons/instagram.png" alt="" />
          <img src="/src/assets/images/icons/youtube.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
