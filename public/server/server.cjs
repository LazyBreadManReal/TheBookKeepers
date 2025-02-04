const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',  // Change this to your database host
    user: 'root',       // Change this to your database username
    password: 'jmgaming1011',       // Change this to your database password
    database: 'goatwebsite' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});



app.get('/api/get-listings', (req, res) => {
    query = "SELECT * FROM listings"
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching listings:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json(results);
    });
})

app.post('/api/add-listing', (req, res) => {
    const { listing_name, listing_email, price, location, description } = req.body;

    if (!listing_name || !listing_email || !price || !location || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = "INSERT INTO listings (listing_name, listing_email, price, location, description) VALUES (?, ?, ?, ?, ?)";
    
    db.query(query, [listing_name, listing_email, price, location, description], (err, result) => {
        if (err) {
            console.error('Error inserting listing:', err);
            return res.status(500).json({ error: 'Database insert error' });
        }
        return res.status(201).json({ message: 'Listing added successfully', id: result.insertId });
    });
});


app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
})