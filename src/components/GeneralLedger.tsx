import { useState, useEffect } from "react";
import "../assets/css/GeneralLedger.css";
import NavBar from "./NavBar";
import SwitchBar from "./SwitchBar";

interface LedgerEntry {
  id: number;
  account: string;
  account_title: string;
  date: string;
  debit?: number;
  credit?: number;
}

const GeneralLedger = () => {
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
        console.log("Fetched Data:", data); // Log the API response
        setLedgerEntries(data);
      })
      .catch((err) => console.error("Error fetching journal entries:", err));
  }, []);
  
  // Group entries by account_title
  const groupedEntries = ledgerEntries.reduce((acc, entry) => {
    if (!entry.account_title) return acc; // Skip entries without an account title
    if (!acc[entry.account_title]) acc[entry.account_title] = [];
    acc[entry.account_title].push(entry);
    return acc;
  }, {} as Record<string, LedgerEntry[]>);

  console.log("Grouped Entries:", groupedEntries);

  return (
    <>
      <NavBar></NavBar>
      <div className="ledger-container">
        <h2>General Ledger</h2>
        <div className="ledger-content">
          {Object.entries(groupedEntries).map(([accountTitle, entries]) => {
            // Grouping by debit and credit separately
            const debitEntries = entries.filter((entry) => entry.debit > 0);
            const creditEntries = entries.filter((entry) => entry.credit > 0);
      
            const totalDebit = debitEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
            const totalCredit = creditEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
            const netAmount = totalDebit - totalCredit;
      
            return (
              <div key={accountTitle} className="ledger-account">
                <h3>{entries[0].account_code} - {accountTitle}</h3>
                <table className="ledger-table">
                  <tr>
                    <td>Date/Particulars</td>
                    <td>DEBIT</td>
                    <td>Date/Particulars</td>
                    <td>CREDIT</td>
                  </tr>
                  {debitEntries.map((entry, index) => (
                    <tr key={`debit-${entry.id}`}>
                      <td>{new Date(entry.transaction_date).toLocaleDateString()} | {entry.description}</td>
                      <td>{entry.debit.toLocaleString()}</td>
                      {/* Render empty CREDIT columns for corresponding DEBIT entries */}
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                  {creditEntries.map((entry, index) => (
                    <tr key={`credit-${entry.id}`}>
                      {/* Render empty DEBIT columns for corresponding CREDIT entries */}
                      <td></td>
                      <td></td>
                      <td>{new Date(entry.transaction_date).toLocaleDateString()} | {entry.description}</td>
                      <td>{entry.credit.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                      <td >Total</td>
                      <td>{totalDebit.toLocaleString()}</td>
                      <td></td>
                      <td>{totalCredit.toLocaleString()}</td>
                    </tr>
                    <tr className="net-amount-row">
                      <td></td>
                      <td></td>
                      <td>Net Amount</td>
                      <td>{netAmount.toLocaleString()}</td>
                    </tr>
                </table>
              </div>
            );
          })}
        </div>
      </div>
      <SwitchBar />
    </>
  );  

};

export default GeneralLedger;
