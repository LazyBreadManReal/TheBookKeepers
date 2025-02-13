import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/MainPage.css";
import goatImage from "../assets/images/goats/goat.png";

const Navbar: React.FC = () => {
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
      <div className="about-us-section">
        <div className="about-us">
          <h1>About Us</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            tellus vitae ex cursus dictum. Sed vel velit non velit cursus
            cursus. Donec auctor ipsum sed eros interdum, at efficitur neque
            consectetur. Sed non felis et urna placerat aliquet. Donec vel felis
            vel sapien tristique placerat. Nulla facilisi. Donec volutpat lacus
            vel justo tempus, id faucibus mauris consectetur. Sed ac pulvinar
            ex, vel malesuada risus. Duis vel libero non neque tincidunt
            pellentesque.
          </p>
        </div>
        <img src={goatImage} />
      </div>
      <div className="general-info">
        <div className="news">
          <h1>News</h1>
          <p> News and updates</p>
          <div className="news-items">
            <div>
              <h2>News Title</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
                tellus vitae ex cursus dictum.
              </p>
              <a href="#">Read More</a>
            </div>
            <div>
              <h2>News Title</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
                tellus vitae ex cursus dictum.
              </p>
              <a href="#">Read More</a>
            </div>
          </div>
        </div>
        <div className="condensed-view">
          <div className="sign-up">
            <h2>Sign Up for Our Newsletter</h2>
            <p>Sign up to receive updates and newsletters from our website.</p>
            <form action="#" method="post">
              <input
                type="text"
                name="email"
                placeholder="Enter your email address"
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className="contact">
            <h2>Contact Us</h2>
            <p>Sign up to receive updates and newsletters from our website.</p>
            <form action="#" method="post">
              <input
                type="text"
                name="email"
                placeholder="Enter your email address"
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className="placeholder">
            <h2>placeholder</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est
              omnis sequi ut accusamus fugiat
            </p>
          </div>
          <div className="placeholder">
            <h2>placeholder</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est
              omnis sequi ut accusamus fugiat
            </p>
          </div>
          <div className="placeholder">
            <h2>placeholder</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est
              omnis sequi ut accusamus fugiat
            </p>
          </div>
          <div className="placeholder">
            <h2>placeholder</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est
              omnis sequi ut accusamus fugiat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
