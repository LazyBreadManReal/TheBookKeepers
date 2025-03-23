import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/HomePage.css";
import "../assets/css/NavBar.css"



const HomePage: React.FC = () => {
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
          <div className="info-graphic">
            <img src="/src/assets/images/Icon.png" alt="" />
            <h1>BOOKKEEPING SERVICES</h1>
            <p>Our centralized database enables users to securely input, store, and access their financial data, ensuring efficient and reliable bookkeeping for businesses of all sizes. Whether clients manage their own records or rely on our expertise, we provide high-quality support and cost-effective solutions tailored to their needs.</p>
          </div>
          <div className="login-section">
            <div className="login-up-section">
            </div>
            {user ? (
              <div className="welcome-section">
                <h2>Welcome, {user.name}!</h2>
                <button onClick={() => navigate("/ChartOfAccounts")}>Edit Chart of Accounts</button>
                <button onClick={() => navigate("/GeneralJournal")}>Edit General Journal</button>
                <button onClick={() => navigate("/GeneralLedger")}>General Ledger</button>
                <button onClick={() => navigate("/TrialBalance")}>Trial Balance</button>
                <button onClick={() => navigate("/BalanceSheet")}>Balance Sheet</button>
                <button onClick={() => navigate("/IncomeStatement")}>Income Statement</button>
                <button onClick={() => navigate("/OwnersEquity")}>Owners Equity</button>
                <button onClick={() => navigate("/StatementOfCashflow")}>Statement Of Cashflow</button>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="login-form-section">
                <img src="/src/assets/images/Logo v2.png" alt="Logo" className="logo" />
                <form onSubmit={handleSubmit} className="login-form">
                  {isSignUp && (
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  )}
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email here"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password here"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="login-btn">
                    {isSignUp ? "Sign Up" : "Login"}
                  </button>
                </form>
                {error && <p className="error-text">{error}</p>}
                <p className="signup-text">
                  {isSignUp ? (
                    <>Already have an account? <a href="#" onClick={() => setIsSignUp(false)}>Log in here</a></>
                  ) : (
                    <>Don't have an account? <a href="#" onClick={() => setIsSignUp(true)}>Sign up here</a></>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
