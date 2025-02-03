import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import MainPage from "./components/MainPage";
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

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavigationBar />
              <MainPage />
              <Footer />
            </>
          }
        />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Market" element={<MarketPage />} />
      </Routes>
    </Router>
  );
};

export default App;
