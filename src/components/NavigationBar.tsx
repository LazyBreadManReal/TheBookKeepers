
import React from "react";
import "../assets/css/NavigationBar.css";   
import { Link } from "react-router-dom";


const NavigationBar: React.FC = () => {
  return (
    <div className="nav-menu">
        <header>
            <h1>Goat Website</h1>
        </header>
        <nav>
            <ul>
                <li className="nav-about"><a href="#about-pcshs">About</a></li>
                <li><Link to="/Registration">Login</Link></li>
                <li><a >Contact</a></li>
                <li className="nav-announcements">
                    <a href="announcements.html">Announcements</a>
                    <div className="nav-announcements-window">
                        <a href="">General</a>
                        <a href="">Grade 7</a>
                        <a href="">Grade 8</a>
                        <a href="">Grade 9</a>
                        <a href="">Grade 10</a>
                        <a href="">Grade 11</a>
                        <a href="">Grade 12</a>
                    </div>
                </li>
                <li className="nav-activities">
                    <a href="activities.html">Activities</a>
                    <div className="nav-activities-window">
                        <a href="">General</a>
                        <a href="">Grade 7</a>
                        <a href="">Grade 8</a>
                        <a href="">Grade 9</a>
                        <a href="">Grade 10</a>
                        <a href="">Grade 11</a>
                        <a href="">Grade 12</a>
                    </div>
                </li>
                <li><a href="#event-summary-section">Events</a></li>
                <li><a href="">Calendar</a></li>
                <li><a href="goats.html">Goats</a></li>
            </ul>
        </nav> 
    </div>
  );
};

export default NavigationBar;
