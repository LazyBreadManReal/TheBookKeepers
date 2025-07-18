const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;
const databaseName = "bookkeepingdata"

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_ROOT,
    password: process.env.DB_PASSWORD,
});

const defaultAccounts = [
    { account_code: 100, account_title: "ASSETS" },
    { account_code: 101, account_title: "Cash on hand" },
    { account_code: 102, account_title: "Cash in bank" },
    { account_code: 103, account_title: "Notes Receivable" },
    { account_code: 104, account_title: "Interest Receivable" },
    { account_code: 105, account_title: "Accounts Receivable" },
    { account_code: 106, account_title: "Advances to Employees" },
    { account_code: 107, account_title: "Office Supplies Inventory" },
    { account_code: 108, account_title: "Store Supplies on hand" },
    { account_code: 109, account_title: "Prepaid insurance" },
    { account_code: 120, account_title: "Land" },
    { account_code: 200, account_title: "LIABILITIES" },
    { account_code: 201, account_title: "Notes Payable" },
    { account_code: 202, account_title: "Accounts Payable" },
    { account_code: 300, account_title: "OWNER'S EQUITY" },
    { account_code: 301, account_title: "Capital" },
    { account_code: 400, account_title: "INCOME" },
    { account_code: 401, account_title: "Service income" },
    { account_code: 500, account_title: "EXPENSES" },
    { account_code: 501, account_title: "Salaries expense" },
    { account_code: 502, account_title: "Rent expense" }
];

const UsersTableFormat = `
    CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) NOT NULL, 
        email VARCHAR(255) UNIQUE, 
        password VARCHAR(255),
        role ENUM("Admin", "Accountant", "User") NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const ChartOfAccountsTableFormat = `
    CREATE TABLE IF NOT EXISTS ChartOfAccounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        account_code INT NOT NULL,
        account_title VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );
`;

const GeneralJournalTableFormat = `
    CREATE TABLE IF NOT EXISTS GeneralJournal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_key int NOT NULL,
        account_code INT NOT NULL,
        account_title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        reference_number VARCHAR(50),
        debit DECIMAL(15,2) DEFAULT 0.00,
        credit DECIMAL(15,2) DEFAULT 0.00,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );
`;




db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

db.query(
    "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
    [databaseName],
    (err, results) => {
        if (err) {
            console.error("Error checking database:", err);
            return;
        }

        if (results.length > 0) {
            console.log(`Database "${databaseName}" already exists.`);
            useDatabase();
        } else {
            console.log(`Database "${databaseName}" does NOT exist. Creating...`);
            createDatabase();
        }
    }
);

function createDatabase() {
    db.query(`CREATE DATABASE ${databaseName}`, (err, result) => {
        if (err) {
            console.error("Error creating database:", err);
            return;
        }
        console.log(`Database "${databaseName}" created successfully.`);
        useDatabase();
    });
}


function useDatabase() {
    db.changeUser({ database: databaseName }, (err) => {
        if (err) {
            console.error("Error switching to database:", err);
            return;
        }
        console.log(`Using database "${databaseName}".`);
        initializeTables();
    });
}

function initializeTables() {
    db.query(UsersTableFormat, (err, results) => {
        if(err){
            console.error("DATABASE ERROR: Users table Initialized failed");
        }
        console.log("DATABASE: TABLE Users Initialized")
    })
    db.query(ChartOfAccountsTableFormat, (err, results) => {
        if(err){
            console.error("DATABASE ERROR: ChartOfAccounts table Initialized failed");
            console.error(err.message);
        }
        console.log("DATABASE: TABLE ChartOfAccounts Initialized")
    });
    db.query(GeneralJournalTableFormat, (err, results) => {
        if(err){
            console.error("DATABASE ERROR: GeneralJournal table Initialized failed");
        }
        console.log("DATABASE: TABLE GeneralJournal Initialized")
    });
}

// **Middleware to Authenticate Token**
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
};

// **SIGNUP ROUTE**
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, hashedPassword, role], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "Email already in use." });
                }
                console.error("Database error:", err);
                return res.status(500).json({ message: "Error creating account." });
            }

            const userId = result.insertId; 
            const accountValues = defaultAccounts.map(acc => [userId, acc.account_code, acc.account_title]);
            const insertChartSql = "INSERT INTO ChartOfAccounts (user_id, account_code, account_title) VALUES ?";
            db.query(insertChartSql, [accountValues], (chartErr) => {
                if (chartErr) {
                    console.error("Error inserting default accounts:", chartErr);
                    return res.status(500).json({ message: "Error setting up default accounts." });
                }
                res.status(201).json({ message: "User registered successfully with default accounts!" });
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error." });
    }
});



// **LOGIN ROUTE**
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password." });
    }

    const query = "SELECT * FROM Users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error." });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Incorrect password or email" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password or email" });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.json({ message: "Login successful.", token, name: user.name });
    });
});

// **Fetch all general journal entries for the logged-in user**
app.get("/api/general-journal", authenticateToken, (req, res) => {
    const query = `
        SELECT id, transaction_date, transaction_key, account_code, account_title, description, reference_number, debit, credit
        FROM GeneralJournal
        WHERE user_id = ?
        ORDER BY transaction_date DESC
    `;
    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            console.error("Database error fetching journal entries:", err);
            return res.status(500).json({ message: "Error fetching journal entries." });
        }
        res.json(results);
    });
});

// **Add a new journal entry linked to the logged-in user**
app.post("/api/general-journal", authenticateToken, (req, res) => {
    const { 
        transaction_date, 
        transaction_key, 
        account_code_debit, 
        account_title_debit, 
        account_code_credit, 
        account_title_credit, 
        description, 
        reference_number, 
        amount 
    } = req.body;

    if (!transaction_date || !account_code_debit || !account_title_debit || !account_code_credit || !account_title_credit || !description) {
        return res.status(400).json({ message: "Transaction date, account codes, account titles, and description are required." });
    }

    const userId = req.user.userId;
    const refNumber = reference_number || null;
    const transactionAmount = amount || 0.00;

    const debit_query = `
        INSERT INTO GeneralJournal (user_id, transaction_date, transaction_key, account_code, account_title, description, reference_number, debit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const credit_query = `
        INSERT INTO GeneralJournal (user_id, transaction_date, transaction_key, account_code, account_title, description, reference_number, credit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction start error:", err);
            return res.status(500).json({ message: "Database transaction error." });
        }

        // Insert Debit Entry
        db.query(
            debit_query, 
            [userId, transaction_date, transaction_key, account_code_debit, account_title_debit, description, refNumber, transactionAmount], 
            (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Database error inserting debit entry:", err);
                        res.status(500).json({ message: "Error adding debit entry." });
                    });
                }

                // Insert Credit Entry
                db.query(
                    credit_query, 
                    [userId, transaction_date, transaction_key, account_code_credit, account_title_credit, description, refNumber, transactionAmount], 
                    (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Database error inserting credit entry:", err);
                                res.status(500).json({ message: "Error adding credit entry." });
                            });
                        }

                        // Commit Transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Transaction commit error:", err);
                                    res.status(500).json({ message: "Transaction commit failed." });
                                });
                            }

                            res.status(201).json({
                                message: "Transaction added successfully",
                                transaction_key,
                                transaction_date,
                                description,
                                reference_number: refNumber,
                                amount: transactionAmount
                            });
                        });
                    }
                );
            }
        );
    });
});

// **Update an existing journal entry**
app.put("/api/general-journal/:transaction_key", authenticateToken, (req, res) => {
    const { transaction_key } = req.params;
    const { transaction_date, account_code_debit, account_title_debit, account_code_credit, account_title_credit, description, reference_number, amount } = req.body;

    if (!transaction_date || !account_code_debit || !account_title_debit || !account_code_credit || !account_title_credit || !description) {
        return res.status(400).json({ message: "Transaction date, account codes, account titles, and description are required." });
    }

    const userId = req.user.userId;
    const refNumber = reference_number || null;
    const transactionAmount = amount || 0.00;

    const update_debit_query = `
        UPDATE GeneralJournal
        SET transaction_date = ?, account_code = ?, account_title = ?, description = ?, reference_number = ?, debit = ?
        WHERE transaction_key = ? AND user_id = ? AND debit > 0
    `;

    const update_credit_query = `
        UPDATE GeneralJournal
        SET transaction_date = ?, account_code = ?, account_title = ?, description = ?, reference_number = ?, credit = ?
        WHERE transaction_key = ? AND user_id = ? AND credit > 0
    `;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction start error:", err);
            return res.status(500).json({ message: "Database transaction error." });
        }

        // Update Debit Entry
        db.query(
            update_debit_query, 
            [transaction_date, account_code_debit, account_title_debit, description, refNumber, transactionAmount, transaction_key, userId], 
            (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Database error updating debit entry:", err);
                        res.status(500).json({ message: "Error updating debit entry." });
                    });
                }

                // Update Credit Entry
                db.query(
                    update_credit_query, 
                    [transaction_date, account_code_credit, account_title_credit, description, refNumber, transactionAmount, transaction_key, userId], 
                    (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Database error updating credit entry:", err);
                                res.status(500).json({ message: "Error updating credit entry." });
                            });
                        }

                        // Commit Transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Transaction commit error:", err);
                                    res.status(500).json({ message: "Transaction commit failed." });
                                });
                            }

                            res.json({
                                message: "Transaction updated successfully",
                                transaction_key,
                                transaction_date,
                                description,
                                reference_number: refNumber,
                                amount: transactionAmount
                            });
                        });
                    }
                );
            }
        );
    });
});

// **Delete a journal entry**
app.delete("/api/general-journal/:transaction_key", authenticateToken, (req, res) => {
    const { transaction_key } = req.params;

    const query = `
        DELETE FROM GeneralJournal WHERE transaction_key = ? AND user_id = ?
    `;

    db.query(query, [transaction_key, req.user.userId], (err, result) => {
        if (err) {
            console.error("Database error deleting journal entry:", err);
            return res.status(500).json({ message: "Error deleting journal entry." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Journal entry not found or unauthorized." });
        }
        res.json({ message: "Journal entry deleted successfully." });
    });
});


app.get("/api/chart-of-accounts", authenticateToken, (req, res) => {
    const query = `SELECT id, account_code, account_title FROM ChartOfAccounts WHERE user_id = ? ORDER BY account_code ASC`;

    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            console.error("Error fetching chart of accounts:", err);
            return res.status(500).json({ message: "Error retrieving accounts." });
        }
        res.json(results);
    });
});

app.post("/api/chart-of-accounts", authenticateToken, (req, res) => {
    const { account_code, account_title } = req.body;

    if (!account_code || !account_title) {
        return res.status(400).json({ message: "Account code and title are required." });
    }

    const query = `INSERT INTO ChartOfAccounts (user_id, account_code, account_title) VALUES (?, ?, ?)`;

    db.query(query, [req.user.userId, account_code, account_title], (err, result) => {
        if (err) {
            console.error("Error adding new account:", err);
            return res.status(500).json({ message: "Error adding account." });
        }
        res.status(201).json({ id: result.insertId, account_code, account_title });
    });
});

app.put("/api/chart-of-accounts/:id", authenticateToken, (req, res) => {
    const { account_title } = req.body;
    const accountId = req.params.id;

    if (!account_title) {
        return res.status(400).json({ message: "Account title is required." });
    }

    const query = `UPDATE ChartOfAccounts SET account_title = ? WHERE id = ? AND user_id = ?`;

    db.query(query, [account_title, accountId, req.user.userId], (err, result) => {
        if (err) {
            console.error("Error updating account:", err);
            return res.status(500).json({ message: "Error updating account." });
        }
        res.json({ message: "Account updated successfully." });
    });
});

app.delete("/api/chart-of-accounts/:id", authenticateToken, (req, res) => {
    const accountId = req.params.id;

    const query = `DELETE FROM ChartOfAccounts WHERE id = ? AND user_id = ?`;

    db.query(query, [accountId, req.user.userId], (err, result) => {
        if (err) {
            console.error("Error deleting account:", err);
            return res.status(500).json({ message: "Error deleting account." });
        }
        res.json({ message: "Account deleted successfully." });
    });
});


app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
})