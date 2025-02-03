import React, { useEffect, useState } from "react";
import "../assets/css/SignUpPage.css";
import GoogleIcon from "../assets/images/google-icon.png"
import FacebookIcon from "../assets/images/facebook-icon.png"
import InstagramIcon from "../assets/images/instagram-icon.png"

const SignUpPage: React.FC = () => {
  const RedirectToSignUp = () => {
    window.location.href = 'http://localhost:5173/signup';
  };

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
              <input type="email" placeholder="Email" id="email" />
              <input
                type="password"
                placeholder="Password"
                id="password"
              />
              <button type="submit" className="login-btn">
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

export default SignUpPage;
