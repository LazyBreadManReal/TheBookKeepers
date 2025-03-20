import { useState, useEffect } from "react";
import "../assets/css/ChartOfAccounts.css";

interface Account {
  id: number;
  account_code: string;
  account_title: string;
}

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState({ account_code: "", account_title: "" });

  useEffect(() => {
    fetch("/api/chart-of-accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Error fetching accounts:", err));
  }, []);

  const addAccount = async () => {
    if (!newAccount.account_code || !newAccount.account_title) return;

    const res = await fetch("/api/chart-of-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    });

    if (res.ok) {
      setAccounts([...accounts, { id: accounts.length + 1, ...newAccount }]);
      setNewAccount({ account_code: "", account_title: "" });
    }
  };

  return (
    <div className="chart-container">
      <h2>Chart of Accounts</h2>
      <ul>
        {accounts.map((acc) => (
          <li key={acc.id}>
            {acc.account_code} - {acc.account_title}
          </li>
        ))}
      </ul>
      <div className="add-account">
        <input
          type="text"
          placeholder="Account Code"
          value={newAccount.account_code}
          onChange={(e) => setNewAccount({ ...newAccount, account_code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Account Title"
          value={newAccount.account_title}
          onChange={(e) => setNewAccount({ ...newAccount, account_title: e.target.value })}
        />
        <button onClick={addAccount}>Add Account</button>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
