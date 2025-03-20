import { useState, useEffect } from "react";
import "../assets/css/IncomeStatement.css";

interface LedgerEntry {
  id: number;
  account_code: string;
  account_title: string;
  debit?: number;
  credit?: number;
  transaction_date: string;
}

const OwnersEquity = () => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/general-journal", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setLedgerEntries(data);
      })
      .catch((err) => console.error("Error fetching journal entries:", err));
  }, []);

  // Categorizing based on account codes for Statement of Owners Equity
  const capital = ledgerEntries.filter(entry => String(entry.account_code) === "301");
  const drawing = ledgerEntries.filter(entry => String(entry.account_code) === "302");
  const revenue = ledgerEntries.filter(entry => String(entry.account_code).startsWith("4"));
  const expenses = ledgerEntries.filter(entry => String(entry.account_code).startsWith("5"));

  const calculateTotal = (entries: LedgerEntry[]) => {
    // Calculate the total of debits and credits
    const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    
    return { totalDebit, totalCredit };
  };

  // Calculate the Net Income (Revenue - Expenses)
  const revenueTotal = calculateTotal(revenue);
  const expensesTotal = calculateTotal(expenses);
  const netIncome = revenueTotal.totalDebit - expensesTotal.totalCredit;

  // Calculate the Total Capital and Drawing
  const capitalTotal = calculateTotal(capital).totalDebit; // Assuming capital is credited
  const drawingTotal = calculateTotal(drawing).totalCredit; // Assuming drawing is debited

  // Calculate Equity End (Capital + Net Income - Drawing)
  const equityEnd = capitalTotal + netIncome - drawingTotal;

  return (
    <div className="balance-sheet-container">
      <h2>Bora-Kaye Salon</h2>
      <h3>Statement of Owners Equity</h3>
      <h4>For the period ending {new Date().toLocaleDateString()}</h4>

      <div className="balance-sheet-table">
        <div className="category-column">
          <h1>Add:</h1>
          <div className="category-content">
            <table className="category-table">
              {capital.map((entry) => (
                <tr key={entry.id} className="balance-item">
                  <td>{entry.account_title}</td>
                  <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                  <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                </tr>
              ))}
              <tr>
                <td>Net income</td>
                <td>{netIncome.toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>

        <div className="category-column">
          <h1>Deduct:</h1>
          <div className="category-content">
            <table className="category-table">
              {drawing.map((entry) => (
                <tr key={entry.id} className="balance-item">
                  <td>{entry.account_title}</td>
                  <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                  <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                </tr>
              ))}
            </table>
            <div className="balance-sheet-total">
              <p>Equity End:</p>
              <p>{equityEnd.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnersEquity;
