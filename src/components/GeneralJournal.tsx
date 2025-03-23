import { useState, useEffect } from "react";
import "../assets/css/GeneralJournal.css";
import NavBar from "./NavBar";
import SwitchBar from "./SwitchBar";

interface JournalEntry {
  id: number;
  transaction_date: string;
  transaction_key: number;
  account_code_debit: string;
  account_title_debit: string;
  account_code_credit: string;
  account_title_credit: string;
  description: string;
  reference_number: string | null;
  amount: number;
}

interface JournalEntrySingle {
  id: number;
  transaction_date: string;
  transaction_key: number;
  account_code: string;
  account_title: string;
  description: string;
  reference_number: string | null;
  debit: number;
  credit: number;
}

interface Account {
  account_code_debit: string;
  account_title_debit: string;
  account_code_credit: string;
  account_title_credit: string;
}

const GeneralJournal = () => {

  const [entries, setEntries] = useState<JournalEntrySingle[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [groupedEntries, setGroupedEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    transaction_date: "",
    transaction_key: 1,
    account_code_debit: "",
    account_title_debit: "",
    account_code_credit: "",
    account_title_credit: "",
    description: "",
    reference_number: "",
    amount: 0,
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

  const groupEntries = () => {
    const groupedEntries = entries.reduce((acc, entry) => {
      if (!acc[entry.transaction_key]) {
        acc[entry.transaction_key] = [];
      }
      acc[entry.transaction_key].push(entry);
      return acc;
    }, {} as Record<number, JournalEntrySingle[]>);
  
    return Object.entries(groupedEntries).map(([transactionKey, entryArray]) => {
      if (entryArray.length === 2) {
        return {
          transaction_key: Number(transactionKey),
          transaction_date: entryArray[0].transaction_date,
          description: entryArray[0].description,
          reference_number: entryArray[0].reference_number,
          account_code_debit: entryArray[0].account_code,
          account_title_debit: entryArray[0].account_title,
          account_code_credit: entryArray[1].account_code,
          account_title_credit: entryArray[1].account_title,
          amount: entryArray[0].debit || entryArray[1].credit, // Assuming debit is in first, credit in second
          id_debit: entryArray[0].id,
          id_credit: entryArray[1].id,
        };
      }
      return null; // Skip incomplete transactions
    }).filter(Boolean); // Remove null values
  };
  
  

  const handleSave = async () => {
    if (
      !newEntry.transaction_date ||
      !newEntry.account_code_debit ||
      !newEntry.account_title_debit ||
      !newEntry.account_code_credit ||
      !newEntry.account_title_credit ||
      !newEntry.description
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    const formattedEntry = {
      transaction_date: newEntry.transaction_date,
      transaction_key: newEntry.transaction_key, // Ensure this is included
      account_code_debit: Number(newEntry.account_code_debit),
      account_title_debit: newEntry.account_title_debit,
      account_code_credit: Number(newEntry.account_code_credit),
      account_title_credit: newEntry.account_title_credit,
      description: newEntry.description,
      reference_number: newEntry.reference_number || null,
      amount: Number(newEntry.amount) || 0.0, // Ensure amount is a number
    };
  
    try {
      if (editingId !== null) {
        // **Edit existing entry**
        const res = await fetch(`http://localhost:5000/api/general-journal/${newEntry.transaction_key}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEntry),
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to update entry:", errorText);
          throw new Error("Failed to update entry");
        }
      } else {
        // **Add new entry**
        formattedEntry.transaction_key = Math.floor(entries.length / 2) + 1;
        const res = await fetch("http://localhost:5000/api/general-journal", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEntry),
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to add journal entry:", errorText);
          throw new Error("Failed to add journal entry");
        }
      }
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Failed to save entry. Please check console for details.");
    }
  
    // Reset form with a new transaction_key
    refreshEntries();
    setEditingId(null);
    setNewEntry({
      transaction_date: "",
      transaction_key: 1, // Ensure a new key is generated
      account_code_debit: "",
      account_title_debit: "",
      account_code_credit: "",
      account_title_credit: "",
      description: "",
      reference_number: "",
      amount: 0,
    });
  };

  const refreshEntries = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch("http://localhost:5000/api/general-journal", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch entries");
      }
  
      const data: JournalEntrySingle[] = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Error refreshing entries:", err);
      alert("Failed to refresh entries. Check console for details.");
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setNewEntry({
      ...entry,
      transaction_date: new Date(entry.transaction_date).toISOString().split("T")[0], // Ensures correct date
    });
  };
  
  

  const handleDelete = async (transaction_key: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/general-journal/${transaction_key}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      setEntries(entries.filter(entry => entry.transaction_key !== transaction_key));
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <div className="journal-container">
        <h2>General Journal</h2>
        <div className="journal-table-section">
          <table className="general-journal-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Account Title</th>
                <th>Reference #</th>
                <th>Post No</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {groupEntries().map((entry) => (
              <>
                {/* First Row (Debit) */}
                <tr key={`${entry.transaction_key}-debit`}>
                  <td>{entry.transaction_date.split("T")[0]}</td>
                  <td>{entry.account_title_debit}</td>
                  <td>{entry.reference_number || "N/A"}</td>
                  <td>{entry.account_code_debit}</td>
                  <td>{entry.amount.toFixed(2)}</td> {/* Debit Amount */}
                  <td> </td> {/* Credit is 0 for Debit Row */}
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(entry)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(entry.transaction_key)}>Delete</button>
                  </td>
                </tr>

                {/* Second Row (Credit) */}
                <tr key={`${entry.transaction_key}-credit`}>
                  <td> </td> {/* Empty for spacing */}
                  <td><span className="indent-text">{entry.account_title_credit}</span></td>
                  <td> </td>
                  <td>{entry.account_code_credit}</td>
                  <td> </td> {/* Debit is 0 for Credit Row */}
                  <td>{entry.amount.toFixed(2)}</td> {/* Credit Amount */}
                  <td> </td>
                </tr>
                <tr>
                  <td></td>
                  <td><span className="indent-text"><span className="indent-text">{entry.description}</span></span></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </>
            ))}
            </tbody>
          </table>
        </div>

        <div className="add-entry">
          <input
            type="date"
            value={newEntry.transaction_date}
            onChange={(e) => setNewEntry({ ...newEntry, transaction_date: e.target.value })}
          />
          <select
            value={newEntry.account_code_debit}
            onChange={(e) => {
              const selectedCode = Number(e.target.value);
              const selectedAccount = accounts.find(acc => acc.account_code === selectedCode);

              setNewEntry({
                ...newEntry,
                account_code_debit: selectedCode.toString(),
                account_title_debit: selectedAccount ? selectedAccount.account_title : "",
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
          <select
            value={newEntry.account_code_credit}
            onChange={(e) => {
              const selectedCode = Number(e.target.value);
              const selectedAccount = accounts.find(acc => acc.account_code === selectedCode);

              setNewEntry({
                ...newEntry,
                account_code_credit: selectedCode.toString(),
                account_title_credit: selectedAccount ? selectedAccount.account_title : "",
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
            placeholder="amount"
            value={newEntry.amount}
            onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
          />
          <button onClick={handleSave}>{editingId !== null ? "Save Changes" : "Add Entry"}</button>
        </div>
      </div>
      <SwitchBar />
    </>
  );
};

export default GeneralJournal;
