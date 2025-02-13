import React, { useEffect, useState } from "react";
import "../assets/css/LoginPage.css";
import GoogleIcon from "../assets/images/google-icon.png"
import FacebookIcon from "../assets/images/facebook-icon.png"
import InstagramIcon from "../assets/images/instagram-icon.png"
import axios from "axios";

const LoginPage: React.FC = () => {
  const RedirectToSignUp = () => {
    window.location.href = 'http://localhost:5173/signup';
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
  
      if(response.data.error) {
        setMessage(response.data.error);
        return;
      }

      const { token } = response.data;
      localStorage.setItem("token", token);

      setMessage("Login successful!");
      setTimeout(() => window.location.href = 'http://localhost:5173/', 1000);
      return;
    } catch (error) {
      console.error("Error registering:", error);
      setMessage("An error occurred while registering. Please try again.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-bubble-container">
        <div className="login-bubble">
          <div className="login-section">
            <div className="login-logo">
              <h1>Goat Logo</h1>
            </div>
            <h2>Enjoy the goat website membership</h2>
            <h1>Login to Your Account</h1>
            <p>Login using social networks</p>
            <div className="login-social-icons">
              <a href="#" className="icon">
                <img src={GoogleIcon} alt="google icon"/>
              </a>
              <a href="#" className="icon">
              <img src={FacebookIcon} alt="Facebook icon"/>
              </a>
              <a href="#" className="icon">
              <img src={InstagramIcon} alt="Instagram icon"/>
              </a>
            </div>
            <div className="login-divider">
              <span>OR</span>
            </div>
            <form id="login-form">
              <input type="email" placeholder="Email" name="email" onChange={handleFieldChange}/>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleFieldChange}
              />
              <p>{message}</p>
              <button type="submit" className="login-btn" onClick={handleSubmit}>
                Sign In
              </button>
            </form>
          </div>
          <div className="login-signup-section">
            <h2>New Here?</h2>
            <p>Sign up and discover a great amount of new opportunities!</p>
            <button className="login-signup-btn" onClick={RedirectToSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
      <div className="login-pop-up login-pop-up-hidden">
        <div className="login-pop-up-content"></div>
      </div>
    </div>
  );
};

export default LoginPage;
