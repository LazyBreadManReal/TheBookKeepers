import React, { useEffect, useState } from "react";
import "../assets/css/LoginPage.css";


const SignUpPage: React.FC = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:5000/api/get-user-data")
      .then((response) => response.json())
      .then((json) => setData(json.id))
      .catch((error) => console.error("Error:", error));
  }, []);

  
  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="left-section">
          <h1>Welcome!</h1>
          <p>Join us and discover a great amount of new opportunities.</p>
        </div>
        <div className="signup-section">
          <h2>Create an Account</h2>
          <form id="signup-form">
            <div className="signup-form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                placeholder="Enter your full name"
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="signup-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
            <div className="signup-login-link">
              <p>
                Already have an account? <a href="/Login">Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
