import React, { useEffect, useState } from "react";
import "../assets/css/SignUpPage.css";
import axios from "axios";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRegistry = async(e: React.FormEvent) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
        const response = await fetch(`http://localhost:5000/api/check-if-user-exists?email=${encodeURIComponent(formData.email)}`);
        const data = await response.json();

        if (data.exists) {
            setMessage("User exists.");
        } else {
          try {
            const response = await axios.post("http://localhost:5000/api/register", formData);
        
            if(response.data.error) {
              setMessage(response.data.error);
              return;
            }
            setMessage("Registered");
            return;
          } catch (error) {
            console.error("Error registering:", error);
            setMessage("An error occurred while registering. Please try again.");
          }
        }
    } catch (error) {
        setMessage("Error checking user.");
    }
  }

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
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleFieldChange}
                required
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleFieldChange}
                required
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password} 
                onChange={handleFieldChange}
                required
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword} 
                onChange={handleFieldChange}
                required
              />
            </div>
            <p>{message}</p>
            <button type="submit" className="signup-btn" onClick={submitRegistry}>
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
