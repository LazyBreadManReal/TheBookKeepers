const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "REPLACE_KEY";

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
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            if(err.code == "ER_NO_SUCH_TABLE") {
                CreateTableQuery = "create table users (id int key auto_increment, username varchar(255), email varchar(255), password varchar(255))";
                db.query(CreateTableQuery, (err, results) => {
                    if(err){
                        console.error("DATABASE ERROR: users table Initialized failed");
                    }
                    console.log("DATABASE: TABLE users Initialized")
                })
            }
        }
    });
});

const getUploadPathListingImages = (listingId) => path.join(path.dirname(__dirname), 'listing_images', listingId);


const listing_images_folder = multer.diskStorage({
    destination: (req, file, cb) => {
        const listingId = req.params.listingId;
        const uploadPath = getUploadPathListingImages(listingId);
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    }
});

const upload_listing_image = multer({ storage: listing_images_folder });


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

app.get('/api/get-listing-images/:listingId', (req, res) => {
    const listingId = req.params.listingId;
    const listingPath = getUploadPathListingImages(listingId);

    if (!fs.existsSync(listingPath)) {
        return res.json({ images: [] });
    }

    fs.readdir(listingPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading image directory' });
        }

        const imagePaths = files.map(file => `/public/listing_images/${listingId}/${file}`);
        res.json({ images: imagePaths });
    });
});


const saltRounds = 10; // Number of hashing rounds

async function hashPassword(plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

app.post("/api/register", async (req, res) => {
    const {username, email, password} = req.body;

    if(!username | !email | !password) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const hashedPassword = await hashPassword(password)

        const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if(err) {
                return res.status(500).json({ error: 'Error registering user' });
            }
            
            res.status(201).json({ message: "User registered successfully" });
        })
    } catch(error) {
        res.status(500).json({ message: "Error hashing password" });
    }

});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT password FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const { id, username, password: hashedPassword } = results[0];
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            const token = jwt.sign({ id, username, email }, SECRET_KEY, { expiresIn: "1h" });
            res.json({ message: "Login successful", token });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    });
});

app.get("/api/check-if-user-exists", (req, res) => {
    const { email } = req.query; // Use req.query for GET requests

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const sql = "SELECT id FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length > 0) {
            res.json({ exists: true, message: "User exists" });
        } else {
            res.json({ exists: false, message: "User does not exist" });
        }
    });
});


const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

app.get("/api/protected-route", verifyToken, (req, res) => {
    res.json({ message: "You have access to this protected route!", user: req.user });
});

app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
})