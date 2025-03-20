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
  const [editingAccount, setEditingAccount] = useState<{ id: number; account_code: string; account_title: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/chart-of-accounts", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Error fetching accounts:", err));
  }, []);

  const addAccount = async () => {
    if (!newAccount.account_code || !newAccount.account_title) return;

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/chart-of-accounts", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(newAccount),
    });

    if (res.ok) {
      const createdAccount = await res.json();

      setAccounts((prevAccounts) => 
        [...prevAccounts, createdAccount].sort((a, b) => 
          String(a.account_code).localeCompare(String(b.account_code))
        )
      );

      setNewAccount({ account_code: "", account_title: "" });
    } else {
      console.error("Failed to add account");
    }
  };

  const updateAccount = async (id: number) => {
    if (!editingAccount) return;
  
    const token = localStorage.getItem("token");
  
    const res = await fetch(`http://localhost:5000/api/chart-of-accounts/${id}`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        account_code: editingAccount.account_code,
        account_title: editingAccount.account_title
      }),
    });
  
    if (res.ok) {
      setAccounts((prevAccounts) =>
        prevAccounts
          .map((acc) =>
            acc.id === id
              ? { ...acc, account_code: editingAccount.account_code, account_title: editingAccount.account_title }
              : acc
          )
          .sort((a, b) => String(a.account_code).localeCompare(String(b.account_code))) // Ensure sorting works
      );
      setEditingAccount(null);
    } else {
      console.error("Failed to update account");
    }
  };
  
  

  const deleteAccount = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/chart-of-accounts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setAccounts((prevAccounts) => prevAccounts.filter((acc) => acc.id !== id));
    } else {
      console.error("Failed to delete account");
    }
  };

  return (
    <div className="chart-container">
      <h2>Chart of Accounts</h2>
      <ul>
        {accounts.map((acc) => (
          <li key={acc.id} className="account-item">
            {editingAccount?.id === acc.id ? (
              <div className="account-edit">
                <input
                  type="text"
                  value={editingAccount.account_code}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, account_code: e.target.value })
                  }
                  placeholder="Account Code"
                />
                <input
                  type="text"
                  value={editingAccount.account_title}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, account_title: e.target.value })
                  }
                  placeholder="Account Title"
                />
                <div className="account-actions">
                  <button onClick={() => updateAccount(acc.id)}>✔️ Save</button>
                  <button onClick={() => setEditingAccount(null)}>❌ Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {acc.account_code} - {acc.account_title}
                <div className="account-actions">
                  <button onClick={() => setEditingAccount({ id: acc.id, account_code: acc.account_code, account_title: acc.account_title })}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteAccount(acc.id)}>🗑️ Delete</button>
                </div>
              </>
            )}
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
        <button onClick={addAccount}>➕ Add Account</button>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
