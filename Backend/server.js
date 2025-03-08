const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  // Enable cross-origin resource sharing

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ritujaa@2006',
  database: 'project',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// API endpoint for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM Login1 WHERE username = ? AND pass = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }

    if (result.length > 0) {
      res.status(200).json({ message: 'Login successful', user: result[0] });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
