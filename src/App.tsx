import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import MarketPage from "./components/MarketPage";
import CreateListingPage from "./components/CreateListingPage";
import "./assets/css/App.css"

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavigationBar />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Market" element={<MarketPage />} />
        <Route path="/Market/NewListing" element={<CreateListingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
