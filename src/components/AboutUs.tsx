import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/AboutUs.css";
import "../assets/css/NavBar.css"



const AboutUs: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "", name: "", role: "User" });
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        const response = await axios.post("http://localhost:5000/api/signup", formData);
        alert(response.data.message);
        setIsSignUp(false);
      } else {
        const response = await axios.post("http://localhost:5000/api/login", formData);
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({ name: response.data.name }));
        setUser({ name: response.data.name.name });
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="content">
      <img src="/src/assets/images/background.png" alt="" className="bg-img"/>
      <div className="actual-content-section">
        <div className="navbar">
          <div className="logo-moto-section">
            <img src="/src/assets/images/logowhite.png" alt="" className="logo"/>
            <h2>PAVE YOUR PATH <br />AS WE TRACK THE MATH</h2>
          </div>
          <h1><a href="http://localhost:5173/">THE BOOKKEEPER</a></h1>
          <div className="about-us-section">
            <div className="about-us">
              <h2><a href="http://localhost:5173/aboutus">ABOUT US</a></h2>
            </div>
            <div className="socials">
              <img src="/src/assets/images/icons/facebook-white.png" alt="" />
              <img src="/src/assets/images/icons/twitter.png" alt="" />
              <img src="/src/assets/images/icons/instagram.png" alt="" />
              <img src="/src/assets/images/icons/youtube.png" alt="" />
            </div>
          </div>
        </div>
        <div className="main-section">
          <div className="about-us-info-graphic">
            <h1>About Us</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum distinctio veritatis nam qui earum soluta ullam quia, asperiores illum atque et harum placeat quaerat provident, tempore magni, laboriosam minima. Quaerat.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
