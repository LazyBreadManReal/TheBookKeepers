import { useState, useEffect } from "react";
import "../assets/css/GeneralJournal.css";

interface JournalEntry {
  id: number;
  transaction_date: string;
  account_code: string;
  account_title: string;
  description: string;
  reference_number: string | null;
  debit: number;
  credit: number;
}

interface Account {
  account_code: number;
  account_title: string;
}

const GeneralJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    transaction_date: "",
    account_code: "",
    account_title: "",
    description: "",
    reference_number: "",
    debit: 0,
    credit: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem("token");
    
      try {
        const res = await fetch("http://localhost:5000/api/general-journal", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!res.ok) throw new Error("Failed to fetch journal entries");
        const data = await res.json();
    
        // Adjust transaction_date to ensure correct format
        const adjustedData = data.map(entry => ({
          ...entry,
          transaction_date: new Date(entry.transaction_date).toISOString().split("T")[0] // Ensures correct date
        }));
    
        setEntries(adjustedData);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
      }
    };
    

    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/chart-of-accounts", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch accounts");
        const data = await res.json();
        setAccounts(data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };

    fetchEntries();
    fetchAccounts();
  }, []);

  const handleSave = async () => {
    if (!newEntry.transaction_date || !newEntry.account_code || !newEntry.account_title || !newEntry.description) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    const formattedEntry = {
      transaction_date: newEntry.transaction_date,
      account_code: Number(newEntry.account_code),
      account_title: newEntry.account_title,
      description: newEntry.description,
      reference_number: newEntry.reference_number || null,
      debit: newEntry.debit || 0.0,
      credit: newEntry.credit || 0.0,
    };
  
    try {
      if (editingId !== null) {
        // **Edit existing entry**
        const res = await fetch(`http://localhost:5000/api/general-journal/${editingId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEntry),
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to update entry:", errorText);
          throw new Error("Failed to update entry");
        }
  
        const updatedEntry: JournalEntry = await res.json();
        setEntries(entries.map(entry => (entry.id === editingId ? updatedEntry : entry)));
        setEditingId(null);
      } else {
        // **Add new entry**
        const res = await fetch("http://localhost:5000/api/general-journal", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEntry),
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to add journal entry:", errorText);
          throw new Error("Failed to add journal entry");
        }
  
        const savedEntry: JournalEntry = await res.json();
        setEntries([...entries, savedEntry]);
      }
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Failed to save entry. Please check console for details.");
    }
  
    setNewEntry({
      transaction_date: "",
      account_code: "",
      account_title: "",
      description: "",
      reference_number: "",
      debit: 0,
      credit: 0,
    });
  };
  

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setNewEntry({
      ...entry,
      transaction_date: new Date(entry.transaction_date).toISOString().split("T")[0], // Ensures correct date
    });
  };
  
  

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/general-journal/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <div className="journal-container">
      <h2>General Journal</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Account Code</th>
            <th>Account Title</th>
            <th>Description</th>
            <th>Reference #</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.transaction_date.split("T")[0]}</td>
              <td>{entry.account_code}</td>
              <td>{entry.account_title}</td>
              <td>{entry.description}</td>
              <td>{entry.reference_number || "N/A"}</td>
              <td>{entry.debit.toFixed(2)}</td>
              <td>{entry.credit.toFixed(2)}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(entry)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-entry">
        <input
          type="date"
          value={newEntry.transaction_date}
          onChange={(e) => setNewEntry({ ...newEntry, transaction_date: e.target.value })}
        />
        <select
          value={newEntry.account_code}
          onChange={(e) => {
            const selectedCode = Number(e.target.value);
            const selectedAccount = accounts.find(acc => acc.account_code === selectedCode);

            setNewEntry({
              ...newEntry,
              account_code: selectedCode.toString(),
              account_title: selectedAccount ? selectedAccount.account_title : "",
            });
          }}
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.account_code} value={acc.account_code}>
              {acc.account_code} - {acc.account_title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Description"
          value={newEntry.description}
          onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Reference # (Optional)"
          value={newEntry.reference_number}
          onChange={(e) => setNewEntry({ ...newEntry, reference_number: e.target.value })}
        />
        <input
          type="number"
          placeholder="Debit"
          value={newEntry.debit}
          onChange={(e) => setNewEntry({ ...newEntry, debit: parseFloat(e.target.value) || 0 })}
        />
        <input
          type="number"
          placeholder="Credit"
          value={newEntry.credit}
          onChange={(e) => setNewEntry({ ...newEntry, credit: parseFloat(e.target.value) || 0 })}
        />
        <button onClick={handleSave}>{editingId !== null ? "Save Changes" : "Add Entry"}</button>
      </div>
    </div>
  );
};

export default GeneralJournal;
