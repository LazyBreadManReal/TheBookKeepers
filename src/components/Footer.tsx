import React from "react";
import "../assets/css/Footer.css";

const NavigationBar: React.FC = () => {
  return (
    <>
      <div className="footer">
        <div className="footer-section">
          <nav>
            <h1>Discover</h1>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Books</a>
              </li>
              <li>
                <a href="#">Authors</a>
              </li>
              <li>
                <a href="#">Subjects</a>
              </li>
              <li>
                <a href="#">Collections</a>
              </li>
              <li>
                <a href="#">Advanced Search</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-section">
          <nav>
            <h1>Help</h1>
            <ul>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Suggesting Edits</a>
              </li>
              <li>
                <a href="#">Add a Book</a>
              </li>
              <li>
                <a href="#">Release Notes</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-section">
          <nav>
            <h1>Legal</h1>
            <ul>
              <li>
                <a href="#">Terms of service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Disclaimer</a>
              </li>
              <li>
                <a href="#">DMCA Policy</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-logo">
          <div className="footer-logo-text">
            <div className="footer-logo-title">
              <h1>Goat CO</h1>
            </div>
            <div className="footer-logo-subtitle">
              <h2>Company Wide</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-logo-message">
        <p>© 2025 GoatCo. All rights reserved.</p>
      </div>
    </>
  );
};

export default NavigationBar;
