import { useState, useEffect } from "react";
import "../assets/css/BalanceSheet.css";

interface LedgerEntry {
  id: number;
  account_code: string;
  account_title: string;
  debit?: number;
  credit?: number;
  transaction_date: string;
}

const BalanceSheet = () => {
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

  // Categorizing based on account codes
  const assets = ledgerEntries.filter(entry => String(entry.account_code).startsWith("1"));
  const liabilities = ledgerEntries.filter(entry => String(entry.account_code).startsWith("2"));
  const equity = ledgerEntries.filter(entry => String(entry.account_code).startsWith("3"));

  const calculateTotal = (entries: LedgerEntry[]) => {
    // Calculate the total of debits and credits
    const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    
    return { totalDebit, totalCredit };
  };
  return (
    <div className="balance-sheet-container">
      <h1>{user ? user.name : ""}</h1>
      <h3>Balance Sheet</h3>
      <h4>As of {new Date().toLocaleDateString()}</h4>

      <div className="balance-sheet-table">
        <div className="category-column">
          <h1>Assets</h1>
          <div className="category-content">
            <table className="category-table">
              {assets.map((entry) => (
                <tr key={entry.id} className="balance-item">
                  <td>{entry.account_title}</td>
                  <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                  <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                </tr>
              ))}
            </table>
            <div className="balance-sheet-total">
              <p>Total Assets</p>
              <p>
                {calculateTotal(assets).totalDebit !== calculateTotal(assets).totalCredit ? (
                  <>
                    <div>Debit: {calculateTotal(assets).totalDebit.toLocaleString()}</div>
                    <div>Credit: {calculateTotal(assets).totalCredit.toLocaleString()}</div>
                  </>
                ) : (
                  <>{calculateTotal(assets).totalDebit.toLocaleString()}</>
                )}
              </p>
            </div>
          </div>
        </div>


        <div className="category-column">
          <h1>Liabilities & Capital</h1>
          <div className="category-content">
            <table className="category-table">
              <tr>Liabilities</tr>
              {liabilities.map((entry) => (
                <tr key={entry.id} className="balance-item">
                  <td>{entry.account_title}</td>
                  <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                  <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                </tr>
              ))}
              <tr></tr>
              <tr>Capital</tr>
              {equity.map((entry) => (
                <tr key={entry.id} className="balance-item">
                  <td>{entry.account_title}</td>
                  <td>{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                  <td>{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                </tr>
              ))}

            </table>
            <div className="balance-sheet-total">
              <p>Total Liabilities and Capital</p>
              <p>
                {calculateTotal([...liabilities, ...equity]).totalDebit !== calculateTotal([...liabilities, ...equity]).totalCredit ? (
                  <>
                    <div>Debit: {calculateTotal([...liabilities, ...equity]).totalDebit.toLocaleString()}</div>
                    <div>Credit: {calculateTotal([...liabilities, ...equity]).totalCredit.toLocaleString()}</div>
                  </>
                ) : (
                  <>{calculateTotal([...liabilities, ...equity]).totalDebit.toLocaleString()}</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;

