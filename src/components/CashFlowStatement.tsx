import { useState, useEffect } from "react";
import "../assets/css/CashFlowStatement.css";
import NavBar from "./NavBar";
import SwitchBar from "./SwitchBar";

interface LedgerEntry {
  id: number;
  account_code: string;
  account_title: string;
  debit?: number;
  credit?: number;
  transaction_date: string;
}

const CashFlowStatement = () => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log(JSON.parse(storedUser))
    }

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

  // Categorizing based on account codes for Cash Flow Statement
  const operatingActivities = ledgerEntries.filter(entry =>
    ["4", "2", "5"].some(prefix => String(entry.account_code).startsWith(prefix))
  );
  const investingActivities = ledgerEntries.filter(entry =>
    String(entry.account_code).startsWith("1")
  );
  const financingActivities = ledgerEntries.filter(entry =>
    String(entry.account_code).startsWith("3")
  );

  const calculateTotal = (entries: LedgerEntry[]) => {
    const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    
    return { totalDebit, totalCredit };
  };

  // Calculate total values for each activity type
  const operatingTotal = calculateTotal(operatingActivities);
  const investingTotal = calculateTotal(investingActivities);
  const financingTotal = calculateTotal(financingActivities);

  return (
    <>
      <NavBar />
      <div className="balance-sheet-container">
        <h1>{user ? user.name : ""}</h1>
        <h3>Cash Flow Statement</h3>
        <h4>For the period ending {new Date().toLocaleDateString()}</h4>

        <div className="balance-sheet-table">
          <div className="category-column">
            <h1>Operating Activities</h1>
            <div className="category-content">
              <table className="category-table">
                {operatingActivities.map((entry) => (
                  <tr key={entry.id} className="balance-item">
                    <td>{entry.account_title}</td>
                    <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                    <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>

          <div className="category-column">
            <h1>Investing Activities</h1>
            <div className="category-content">
              <table className="category-table">
                {investingActivities.map((entry) => (
                  <tr key={entry.id} className="balance-item">
                    <td>{entry.account_title}</td>
                    <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                    <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>

          <div className="category-column">
            <h1>Financing Activities</h1>
            <div className="category-content">
              <table className="category-table">
                {financingActivities.map((entry) => (
                  <tr key={entry.id} className="balance-item">
                    <td>{entry.account_title}</td>
                    <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                    <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                  </tr>
                ))}
              </table>
              <div className="balance-sheet-total">
                <p className="net-amount-row">Cash Ending Balance:</p>
                <p className="net-amount-row">{((operatingTotal.totalDebit - operatingTotal.totalCredit) + (investingTotal.totalDebit - investingTotal.totalCredit) + (financingTotal.totalDebit - financingTotal.totalCredit)).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SwitchBar />
    </>
  );
};

export default CashFlowStatement;
