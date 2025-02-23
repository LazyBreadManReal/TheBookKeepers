import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/HomePage.css";
import goatImage from "../assets/images/goats/goat.png";

const HomePage: React.FC = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found in localStorage.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/protected-route", {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure 'Bearer' prefix is included
          },
        });        

        console.log("Protected Route Response:", response.data);
        setUserData(response.data.user); // Save user data from response
      } catch (error) {
        console.error("Error accessing protected route:", error);
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div className="content">
      <div className="intro-banner">
        <div className="intro-banner-gradient"></div>
        <img src={goatImage} alt="goatimage" className="intro-banner-image" />
        <div className="intro-banner-content">
          <p className="company-stand">Insert Company stance</p>
          <button className="become-a-member-button">Become A Member</button>
        </div>
      </div>
      <section className="updates">
        <div className="updates-left">
          <h2>Updates</h2>
          <p>Keep up with announcements, reminders, events.</p>
          <div className="announcement-list">
            <div className="announcement"></div>
            <div className="announcement"></div>
            <div className="announcement"></div>
            <div className="announcement lines"></div>
          </div>
        </div>

        <div className="updates-right">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="newsletter-card">
              <h3>Sign up for a news letter</h3>
              <p>
                Stay updated on the latest news, special offers, and exclusive
                insights. Get valuable updates delivered straight to your inbox.
              </p>
              <button className="signup-btn">
                Sign Up <span className="arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
