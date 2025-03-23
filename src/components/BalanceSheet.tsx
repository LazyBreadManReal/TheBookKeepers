import { useState, useEffect } from "react";
import "../assets/css/BalanceSheet.css";
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
    <>
      <NavBar></NavBar>
      <div className="balance-sheet-container">
        <h1>{user ? user.name : ""}</h1>
        <h3>Balance Sheet</h3>
        <h4>For the period ending {new Date().toLocaleDateString()}</h4>

        <div className="balance-sheet-table">
          <div className="category-column">
            <h1>Assets</h1>
            <div className="category-content">
              <table className="category-table">
                {assets.map((entry) => (
                  <tr key={entry.id} className="balance-item">
                    <td>{entry.account_title}</td>
                    <td className="balnum">{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                    <td className="balnum">{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                  </tr>
                ))}
              </table>
              <div className="balance-sheet-total">
                <p className="net-amount-row">Total Assets</p>
                <div>
                  {calculateTotal(assets).totalDebit !== calculateTotal(assets).totalCredit ? (
                    <>
                      <div className="net-amount-row">Debit: {calculateTotal(assets).totalDebit.toLocaleString()}</div>
                      <div className="net-amount-row">Credit: {calculateTotal(assets).totalCredit.toLocaleString()}</div>
                    </>
                  ) : (
                    <>
                      <div className="net-amount-row">{calculateTotal(assets).totalDebit.toLocaleString()}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="category-column">
            <h1>Liabilities & Capital</h1>
            <div className="category-content">
              <table className="category-table">
                <tr>Liabilities</tr>
                {liabilities.length > 0 ? (
                  liabilities.map((entry) => (
                    <tr key={entry.id} className="balance-item">
                      <td>{entry.account_title}</td>
                      <td className="balnum">{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                      <td className="balnum">{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan="3">N/A</td>
                  </tr>
                )}

                <tr></tr>

                <tr>Capital</tr>
                {equity.length > 0 ? (
                  equity.map((entry) => (
                    <tr key={entry.id} className="balance-item">
                      <td>{entry.account_title}</td>
                      <td className="balnum">{entry.debit ? entry.debit.toLocaleString() : ""}</td>
                      <td className="balnum">{entry.credit ? entry.credit.toLocaleString() : ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan="3">N/A</td>
                  </tr>
                )}
              </table>

              <div className="balance-sheet-total">
                <p className="net-amount-row">Total Liabilities and Capital</p>
                <div>
                  {calculateTotal([...liabilities, ...equity]).totalDebit !== calculateTotal([...liabilities, ...equity]).totalCredit ? (
                    <>
                      <div className="net-amount-row">Debit: {calculateTotal([...liabilities, ...equity]).totalDebit.toLocaleString()}</div>
                      <div className="net-amount-row">Credit: {calculateTotal([...liabilities, ...equity]).totalCredit.toLocaleString()}</div>
                    </>
                  ) : (
                    <>
                      <div className="net-amount-row">{calculateTotal([...liabilities, ...equity]).totalDebit.toLocaleString()}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SwitchBar />
    </>
  );
};

export default BalanceSheet;

