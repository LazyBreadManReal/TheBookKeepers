const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'jmgaming1011',
    database: 'goatwebsite'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');

    //ensure listings table exists
    db.query("SELECT * FROM listings", (err, results) => {
        if (err) {
            if(err.code == "ER_NO_SUCH_TABLE") {
                CreateTableQuery = "create table listings (id int key auto_increment, listing_name varchar(255), listing_email varchar(255), price int, location varchar(255), description text)";
                db.query(CreateTableQuery, (err, results) => {
                    if(err){
                        console.error("DATABASE ERROR: listings table Initialized failed");
                    }
                    console.log("DATABASE: TABLE listings Initialized")
                })
            }
        }
    });
});

const listing_images_folder = multer.diskStorage({
    destination: (req, file, cb) => {
        const listingId = req.params.listingId;
        const uploadPath = path.join(path.dirname(__dirname), 'listing_images', listingId);

        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    }
});

const upload_listing_image = multer({ listing_images_folder });


app.post('/api/upload-images/:listingId', upload_listing_image.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const listingId = req.params.listingId;
    const imagePaths = req.files.map(file => `/public/listing_images/${listingId}/${file.filename}`);

    return res.status(200).json({ message: 'Images uploaded successfully', imagePaths });
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
        const listingId = result.insertId;
        return res.status(201).json({ message: 'Listing added successfully', listingId });
    });
});


app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
})