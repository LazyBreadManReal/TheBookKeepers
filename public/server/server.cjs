const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/get-user-data', (req, res)=> {
    return res.json({ id: "USERID"});
})

app.listen(5000, ()=> {
    console.log('Server is running on port 5000');
})