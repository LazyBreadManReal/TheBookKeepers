import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/SwitchBar.css";

const pages = [
  { path: "/ChartOfAccounts", label: "Chart" },
  { path: "/GeneralJournal", label: "Journal" },
  { path: "/GeneralLedger", label: "Ledger" },
  { path: "/TrialBalance", label: "Trial" },
  { path: "/BalanceSheet", label: "Balance" },
  { path: "/IncomeStatement", label: "Income" },
  { path: "/OwnersEquity", label: "Equity" },
  { path: "/StatementOfCashflow", label: "Cash" },
];

const SwitchBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="switchBar-bar">
      <button
        onClick={() => navigate(-1)}
      >
        {"<"}
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => navigate(page.path)}
        >
          {page.label}
        </button>
      ))}

      <button
        onClick={() => navigate(1)} 
      >
        {">"}
      </button>
    </div>
  );
};

export default SwitchBar;
