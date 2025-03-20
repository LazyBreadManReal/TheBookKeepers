import { useState, useEffect } from "react";
import "../assets/css/GeneralJournal.css";

interface JournalEntry {
  id: number;
  transaction_date: string;
  explanation: string;
  debit: number;
  credit: number;
}

const GeneralJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    transaction_date: "",
    explanation: "",
    debit: 0,
    credit: 0,
  });

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      try {
        const res = await fetch("/api/general-journal", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch journal entries");
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
      }
    };

    fetchEntries();
  }, []);

  const addEntry = async () => {
    if (!newEntry.transaction_date || !newEntry.explanation) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/general-journal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error("Failed to add journal entry");

      const savedEntry: JournalEntry = await res.json();
      setEntries([...entries, savedEntry]); // Use DB-assigned ID
      setNewEntry({ transaction_date: "", explanation: "", debit: 0, credit: 0 });
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  return (
    <div className="journal-container">
      <h2>General Journal</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Explanation</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.transaction_date}</td>
              <td>{entry.explanation}</td>
              <td>{entry.debit.toFixed(2)}</td>
              <td>{entry.credit.toFixed(2)}</td>
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
        <input
          type="text"
          placeholder="Explanation"
          value={newEntry.explanation}
          onChange={(e) => setNewEntry({ ...newEntry, explanation: e.target.value })}
        />
        <input
          type="number"
          placeholder="Debit"
          value={newEntry.debit}
          onChange={(e) =>
            setNewEntry({ ...newEntry, debit: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Credit"
          value={newEntry.credit}
          onChange={(e) =>
            setNewEntry({ ...newEntry, credit: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value) })
          }
        />
        <button onClick={addEntry}>Add Entry</button>
      </div>
    </div>
  );
};

export default GeneralJournal;
