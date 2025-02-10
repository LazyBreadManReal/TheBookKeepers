
import React from "react";
import "../assets/css/NavigationBar.css";   
import { Link } from "react-router-dom";


const NavigationBar: React.FC = () => {
  return (
    <div className="nav-menu">
      <div className="menu-container">
        <header>
            <h1>Goat Website</h1>
        </header>
        <nav>
            <ul>
                <li className="nav-about"><a href="#about-pcshs">About</a></li>
                <li><Link to="/SignUp">Login</Link></li>
                <li><a >Contact</a></li>
                <li><a href="#event-summary-section">Events</a></li>
                <li><a href="">Calendar</a></li>
                <li><a href="/Market">Goats</a></li>
            </ul>
        </nav> 
      </div>
    </div>
  );
};

export default NavigationBar;
