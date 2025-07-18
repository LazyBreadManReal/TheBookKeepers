import { useState, useEffect } from "react";
import "../assets/css/TrialBalance.css";
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

const TrialBalance = () => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [trialBalance, setTrialBalance] = useState<any[]>([]);
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
        generateTrialBalance(data); 
      })
      .catch((err) => console.error("Error fetching journal entries:", err));
  }, []);

  // Function to generate trial balance
  const generateTrialBalance = (entries: LedgerEntry[]) => {
    const balance: Record<string, { debit: number; credit: number; account_code: string }> = {};

    entries.forEach((entry) => {
      const { account_code, account_title, debit, credit } = entry;

      if (!balance[account_title]) {
        balance[account_title] = { debit: 0, credit: 0, account_code };
      }

      if (debit) {
        balance[account_title].debit += debit;
      }

      if (credit) {
        balance[account_title].credit += credit;
      }
    });

    setTrialBalance(Object.entries(balance).map(([accountTitle, amounts]) => ({
      account_code: amounts.account_code,
      account_title: accountTitle,
      debit: amounts.debit,
      credit: amounts.credit,
    })));
  };

  return (
    <>
      <NavBar></NavBar>
      <div className="trial-balance-container">
        <h1>{user ? user.name : ""}</h1>
        <h2>Trial Balance</h2>
        <p>For the period ending {new Date().toLocaleDateString()}</p>

        <table className="trial-balance-table">
          <thead>
            <tr>
              <th>Account Code</th>
              <th>Account Title</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {trialBalance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.account_code}</td>
                <td>{entry.account_title}</td>
                <td>{entry.debit.toLocaleString()}</td>
                <td>{entry.credit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong></strong></td> {/* Empty cell for spacing */}
              <td><strong>{trialBalance.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}</strong></td>
              <td><strong>{trialBalance.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <SwitchBar />
    </>
  );
};

export default TrialBalance;
