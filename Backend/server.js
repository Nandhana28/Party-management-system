const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = db.promise();

// Helper Functions
const generateUniqueId = async () => {
  let uniqueId;
  let rows = [1]; // Initialize with dummy data to enter the loop
  do {
    uniqueId = Math.floor(100000 + Math.random() * 900000);
    [rows] = await promisePool.execute("SELECT id FROM clients WHERE id = ?", [uniqueId]);
  } while (rows.length > 0);
  return uniqueId;
};

// CLIENT ENDPOINTS

// Register Client
app.post("/register", async (req, res) => {
  const { firstName, middleName, lastName, email, dob, phoneNumber, username, password } = req.body;

  try {
    // Check if user exists
    const [existing] = await promisePool.execute(
      "SELECT * FROM clients WHERE userName = ? OR email = ?", 
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Create new user
    const clientId = await generateUniqueId();
    const hashedPassword = await bcrypt.hash(password, 10);

    await promisePool.execute(
      `INSERT INTO clients (id, firstName, middleName, lastName, email, dob, phone, userName, pass)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [clientId, firstName, middleName, lastName, email, dob, phoneNumber, username, hashedPassword]
    );

    res.status(201).json({ message: "Registration successful", clientId });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Client Login
app.post("/Clientlogin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await promisePool.execute(
      "SELECT * FROM clients WHERE userName = ?", 
      [username]
    );

    if (users.length === 0 || !(await bcrypt.compare(password, users[0].pass))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    res.json({ 
      message: "Login successful",
      user: {
        id: user.id,
        username: user.userName,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// EVENT MANAGEMENT

// Create Event
app.post("/create-event", async (req, res) => {
  const { ENAME, startDate, endDate, location, etype, noOfguests, clientID } = req.body;

  try {
    // Verify client exists
    const [clients] = await promisePool.execute(
      "SELECT id FROM clients WHERE id = ?", 
      [clientID]
    );
    if (clients.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const noOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const noOfHours = noOfDays * 8;

    // Create event
    const EId = 'EV' + Math.floor(10000 + Math.random() * 90000);
    
    await promisePool.execute(
      `INSERT INTO eventDetails 
       (EId, ENAME, startDate, endDate, noOfDays, noOfHours, location, etype, noOfguests, clientID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [EId, ENAME, startDate, endDate, noOfDays, noOfHours, location, etype, noOfguests, clientID]
    );

    res.status(201).json({ 
      message: "Event created successfully",
      eventId: EId,
      noOfDays: noOfDays
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// FOOD BOOKING SYSTEM

// Get All Food Items
app.get('/food-items', async (req, res) => {
  try {
    const [items] = await promisePool.execute('SELECT * FROM food');
    res.json(items);
  } catch (error) {
    console.error("Food items error:", error);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

// Add Food to Event
app.post('/add-food-to-event', async (req, res) => {
  const { client_id, event_id, food_id, quantity = 1, special_instructions = '', totalCost = 0 } = req.body;
  
  try {
    // Check if references exist
    const [event] = await promisePool.execute(
      "SELECT EId FROM eventDetails WHERE EId = ?", 
      [event_id]
    );
    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const [food] = await promisePool.execute(
      "SELECT fid FROM food WHERE fid = ?", 
      [food_id]
    );
    if (food.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    // Insert or update food booking
    await promisePool.execute(
      `INSERT INTO clientFood 
       (client_id, event_id, food_id, quantity, special_instructions, total_cost)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       quantity = VALUES(quantity),
       special_instructions = VALUES(special_instructions),
       total_cost = VALUES(total_cost)`,
      [client_id, event_id, food_id, quantity, special_instructions, totalCost]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Food booking error:", error);
    res.status(500).json({ error: "Failed to book food" });
  }
});

// Calculate and save food booking costs
app.post('/save-food-bookings', async (req, res) => {
  const { client_id, event_id, foodSelections } = req.body;
  
  try {
    // Insert all food selections with calculated costs
    for (const food of foodSelections) {
      await promisePool.execute(
        `INSERT INTO clientFood 
         (client_id, event_id, food_id, quantity, total_cost)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         quantity = VALUES(quantity),
         total_cost = VALUES(total_cost)`,
        [client_id, event_id, food.food_id, food.quantity, food.total_cost]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Food booking save error:", error);
    res.status(500).json({ error: "Failed to save food bookings" });
  }
});

// HALL BOOKING SYSTEM

// Get Halls by City
app.get('/halls-by-city/:city', async (req, res) => {
  try {
    const city = req.params.city.toUpperCase();
    const [halls] = await promisePool.execute(
      "SELECT * FROM hall WHERE UPPER(city) = ?", 
      [city]
    );
    res.json(halls);
  } catch (error) {
    console.error("Hall fetch error:", error);
    res.status(500).json({ error: "Failed to fetch halls" });
  }
});

// Book Hall
app.post('/book-hall', async (req, res) => {
  const { client_id, event_id, hall_id, totalAmount } = req.body;
  
  try {
    await promisePool.execute(
      `INSERT INTO clientHall 
       (client_id, event_id, hall_id, totalAmount)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       hall_id = VALUES(hall_id),
       totalAmount = VALUES(totalAmount)`,
      [client_id, event_id, hall_id, totalAmount]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Hall booking error:", error);
    res.status(500).json({ error: "Failed to book hall" });
  }
});
// Get Event Bookings
app.post("/bookings", async (req, res) => {
  const { clientID } = req.body;

  try {
    const [bookings] = await promisePool.execute(
      "SELECT * FROM eventDetails WHERE clientID = ?", 
      [clientID]
    );
    res.json(bookings);
  } catch (error) {
    console.error("Bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ADMIN ENDPOINT (Legacy)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM Login1 WHERE username = ? AND pass = ?', 
    [username, password], 
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(result.length > 0 ? 200 : 401).json(
        result.length > 0 
          ? { message: 'Login successful', user: result[0] } 
          : { error: 'Invalid credentials' }
      );
  });
});
// Add these endpoints to your server.js file

// Endpoint to get total food costs for an event
app.post('/get-food-costs', async (req, res) => {
  const { client_id, event_id } = req.body;
  
  try {
    const [results] = await promisePool.execute(
      "SELECT SUM(total_cost) as totalCost FROM clientFood WHERE client_id = ? AND event_id = ?",
      [client_id, event_id]
    );
    
    res.json({ 
      totalCost: results[0]?.totalCost || 0 
    });
  } catch (error) {
    console.error("Error fetching food costs:", error);
    res.status(500).json({ error: "Failed to fetch food costs" });
  }
});

// Endpoint to get hall cost for an event
app.post('/get-hall-cost', async (req, res) => {
  const { client_id, event_id } = req.body;
  
  try {
    const [results] = await promisePool.execute(
      "SELECT totalAmount FROM clientHall WHERE client_id = ? AND event_id = ?",
      [client_id, event_id]
    );
    
    res.json({ 
      totalAmount: results[0]?.totalAmount || 0 
    });
  } catch (error) {
    console.error("Error fetching hall cost:", error);
    res.status(500).json({ error: "Failed to fetch hall cost" });
  }
});
// Process payment endpoint - Updated version
app.post('/process-payment', async (req, res) => {
  const { client_id, event_id, account_number, total_amount } = req.body;
  
  try {
    // Begin transaction
    await promisePool.query('START TRANSACTION');

    // Save payment details to the database
    await promisePool.execute(
      `INSERT INTO payment 
       (client_id, event_id, account_number, payment_status, total_amount)
       VALUES (?, ?, ?, 'completed', ?)
       ON DUPLICATE KEY UPDATE 
       account_number = VALUES(account_number),
       payment_status = 'completed',
       total_amount = VALUES(total_amount),
       payment_date = CURRENT_TIMESTAMP`,
      [client_id, event_id, account_number, total_amount]
    );
    
    // Commit transaction
    await promisePool.execute('COMMIT');
    
    // Send success response
    res.json({ 
      success: true,
      message: "Payment processed successfully"
    });
  } catch (error) {
    // Rollback on error
    await promisePool.execute('ROLLBACK');
    console.error("Payment processing error:", error);
    res.status(500).json({ 
      error: "Payment processing failed",
      details: error.message
    });
  }
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
// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});