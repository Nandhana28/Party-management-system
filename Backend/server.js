const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());  // Enable cross-origin resource sharing

// Create a promise-based pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const promisePool = db.promise();  // Create promise-based pool

const generateUniqueId = async () => {
  let uniqueId;
  let exists = true;

  while (exists) {
    // Generate a random 6-digit integer ID
    uniqueId = Math.floor(100000 + Math.random() * 900000);

    // Check if this ID already exists in the database using promise-based query
    const [rows] = await promisePool.execute(
      "SELECT id FROM clients WHERE id = ?",
      [uniqueId]
    );

    // If no rows are found, it means the ID is unique
    if (rows.length === 0) {
      exists = false;
    }
  }

  return uniqueId;
};

app.post("/register", async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    dob,
    phoneNumber,
    username,
    password,
  } = req.body;

  console.log("Received registration request:", req.body); // Check incoming data

  try {
    // Check if username or email already exists
    const checkQuery = "SELECT * FROM clients WHERE userName = ? OR email = ?";
    const [existingUsers] = await promisePool.execute(checkQuery, [username, email]);

    if (existingUsers.length > 0) {
      console.warn("Username or email already exists");
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Generate a unique client ID
    const clientId = await generateUniqueId();

    // Hash password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (bcryptError) {
      console.error("Bcrypt hashing error:", bcryptError);
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Insert new user into the database
    const insertQuery = `
      INSERT INTO clients (id, firstName, middleName, lastName, email, dob, phone, userName, pass)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await promisePool.execute(insertQuery, [
      clientId, firstName, middleName, lastName, email, dob, phoneNumber, username, hashedPassword
    ]);

    console.log("User registered successfully");
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/Clientlogin", async (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM clients WHERE userName = ?";
  try {
    const [result] = await promisePool.execute(query, [username]);

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password with stored hash
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.pass);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.userName } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Database error" });
  }
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

app.get('/today-events', (req, res) => {
  // Query to get events happening today
  const query = `
    SELECT * 
    FROM eventDetails 
    WHERE DATE(startDate) <= CURDATE() 
    AND DATE(endDate) >= CURDATE();
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No events found for today" });
    }

    // Respond with the events happening today
    res.status(200).json({ events: results });
  });
});

app.post("/bookings", async (req, res) => {
  const { clientID } = req.body;

  try {
    const query = "SELECT * FROM eventDetails WHERE clientID = ?";
    const [results] = await promisePool.execute(query, [clientID]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Database error" });
  }
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
