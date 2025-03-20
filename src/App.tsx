import React, { useState } from "react";
import ChartOfAccounts from "./components/ChartOfAccounts";
import GeneralJournal from "./components/GeneralJournal";
import GeneralLedger from "./components/GeneralLedger";
import HomePage from "./components/HomePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./assets/css/App.css"

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ChartOfAccounts" element={<ChartOfAccounts />} />
        <Route path="/GeneralJournal" element={<GeneralJournal />} />
        <Route path="/GeneralLedger" element={<GeneralLedger />} />
      </Routes>
    </Router>
  );
};

export default App;
