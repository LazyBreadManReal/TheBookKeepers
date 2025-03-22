import React, { useState } from "react";
import ChartOfAccounts from "./components/ChartOfAccounts";
import GeneralJournal from "./components/GeneralJournal";
import GeneralLedger from "./components/GeneralLedger";
import HomePage from "./components/HomePage";
import TrialBalance from "./components/TrialBalance";
import BalanceSheet from "./components/BalanceSheet";
import IncomeStatement from "./components/IncomeStatement";
import OwnersEquity from "./components/OwnersEquity";
import StatementOfCashflow from "./components/CashFlowStatement";
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
        <Route path="/TrialBalance" element={<TrialBalance />} />
        <Route path="/BalanceSheet" element={<BalanceSheet />} />
        <Route path="/IncomeStatement" element={<IncomeStatement />} />
        <Route path="/OwnersEquity" element={<OwnersEquity />} />
        <Route path="/StatementOfCashflow" element={<StatementOfCashflow />} />
      </Routes>
    </Router>
  );
};

export default App;
