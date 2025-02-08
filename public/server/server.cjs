const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const listingId = req.params.listingId;
        const uploadPath = path.join(__dirname, 'public', 'listing_images', listingId);

        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    }
});

const upload = multer({ storage });


app.post('/api/upload-images/:listingId', upload.array('images', 10), (req, res) => {
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


    const query = "INSERT INTO listings (listing_name, listing_email, price, location, description, image_folder_path) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [listing_name, listing_email, price, location, description, ""], (err, result) => {
        if (err) {
            console.error('Error inserting listing:', err);
            return res.status(500).json({ error: 'Database insert error' });
        }

        const listingId = result.insertId;
        const imageFolderPath = `/public/listing_images/${listingId}/`;

        const updateQuery = "UPDATE listings SET image_folder_path = ? WHERE id = ?";
        db.query(updateQuery, [imageFolderPath, listingId], (err) => {
            if (err) {
                console.error('Error updating image folder path:', err);
                return res.status(500).json({ error: 'Database update error' });
            }
            return res.status(201).json({ message: 'Listing added successfully', listingId, imageFolderPath });
        });
    });
});


app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
})