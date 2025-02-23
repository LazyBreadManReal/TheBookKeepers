import React from "react";
import "../assets/css/NavigationBar.css";
import { Link } from "react-router-dom";

const NavigationBar: React.FC = () => {
  return (
    <div className="nav-menu">
      <h1 className="website-logo">Goat Website</h1>
      <div className="nav-content">
        <p>Events</p>
        <p>News</p>
        <p>Who we are</p>
        <p>My profile</p>
        <p className="farms">Farms</p>
      </div>
    </div>
  );
};

export default NavigationBar;
