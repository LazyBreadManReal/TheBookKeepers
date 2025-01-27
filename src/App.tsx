import React, { useState } from "react";
import "./assets/css/App.css";
import NavigationBar from "./components/NavigationBar";
import MainPage from "./components/MainPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage";

const App: React.FC = () => {
  // State to hold the h1 text
  const [text, setText] = useState("hello world");

  // Function to change the h1 text
  const changeText = () => {
    if (text == "new text") {
      setText("hello world");
      return;
    }
    setText("new text");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavigationBar />
              <MainPage />
              <main>
                <h1>{text}</h1>
                <button className="expandButton" onClick={changeText}>
                  Change Text
                </button>
              </main>
            </>
          }
        />
        <Route path="/Registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
