import { useState, useEffect } from "react";
import "../assets/css/GeneralLedger.css";

interface LedgerEntry {
  id: number;
  transaction_date: string;
  particulars: string;
  debit: number;
  credit: number;
}

const GeneralLedger = () => {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    fetch("/api/general-ledger")
      .then((res) => res.json())
      .then((data) => setLedger(data))
      .catch((err) => console.error("Error fetching ledger:", err));
  }, []);

  return (
    <div className="ledger-container">
      <h2>General Ledger</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Particulars</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.transaction_date}</td>
              <td>{entry.particulars}</td>
              <td>{entry.debit}</td>
              <td>{entry.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneralLedger;
