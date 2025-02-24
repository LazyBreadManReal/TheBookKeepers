import React from "react";
import "../assets/css/Footer.css";

const NavigationBar: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h3>Discover</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Services / Products</a></li>
            <li><a href="#">Blog / News</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Customer Reviews</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Help</h3>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping & Delivery</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Order Tracking</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Copyright & Trademark</a></li>
            <li><a href="#">Accessibility Statement</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-middle">
        <h1>Goat CO</h1>
        <p>Company wide</p>
        <div className="social-icons">
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 GoatCo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default NavigationBar;
