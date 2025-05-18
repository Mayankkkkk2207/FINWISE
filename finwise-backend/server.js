const http = require('http');
const mysql = require('mysql2');
const url = require('url');
const crypto = require('crypto');
const config = require('./config');

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'finwise_db',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('1234567890')
  }
});

// Helper function to hash passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to generate a token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create tables if they don't exist
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS user_sessions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      token VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      type ENUM('income', 'expense') NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS financial_goals (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      title VARCHAR(100) NOT NULL,
      target_amount DECIMAL(10,2) NOT NULL,
      current_amount DECIMAL(10,2) DEFAULT 0,
      deadline DATE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  ];

  // Execute each table creation query sequentially
  for (const tableQuery of tables) {
    db.query(tableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
    });
  }
  console.log('Database tables created or already exist');
});

// Middleware to verify authentication
function authenticateUser(req, res, callback) {
  const token = req.headers['authorization'];
  if (!token) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Authentication required' }));
    return;
  }

  const query = 'SELECT user_id FROM user_sessions WHERE token = ?';
  db.query(query, [token], (err, results) => {
    if (err || results.length === 0) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Invalid token' }));
      return;
    }
    req.userId = results[0].user_id;
    callback();
  });
}

// Handle CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Parse URL and query parameters
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Add CORS headers to all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle different routes
  if (path === '/api/register' && req.method === 'POST') {
    handleRegister(req, res);
  } else if (path === '/api/login' && req.method === 'POST') {
    handleLogin(req, res);
  } else if (path === '/api/logout' && req.method === 'POST') {
    handleLogout(req, res);
  } else if (path === '/api/transactions' && req.method === 'GET') {
    authenticateUser(req, res, () => handleGetTransactions(req, res));
  } else if (path === '/api/transactions' && req.method === 'POST') {
    authenticateUser(req, res, () => handleAddTransaction(req, res));
  } else if (path.startsWith('/api/transactions/') && req.method === 'DELETE') {
    const id = path.split('/')[3];
    authenticateUser(req, res, () => handleDeleteTransaction(req, res, id));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Handle user registration
function handleRegister(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { username, password } = JSON.parse(body);
      if (!username || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Username and password required' }));
        return;
      }

      const hashedPassword = hashPassword(password);
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      
      db.query(query, [username, hashedPassword], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            res.writeHead(409);
            res.end(JSON.stringify({ error: 'Username already exists' }));
          } else {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Database error' }));
          }
          return;
        }
        res.writeHead(201);
        res.end(JSON.stringify({ message: 'User registered successfully' }));
      });
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid request body' }));
    }
  });
}

// Handle user login
function handleLogin(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { username, password } = JSON.parse(body);
      const hashedPassword = hashPassword(password);
      
      const query = 'SELECT id FROM users WHERE username = ? AND password = ?';
      db.query(query, [username, hashedPassword], (err, results) => {
        if (err || results.length === 0) {
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
          return;
        }

        const userId = results[0].id;
        const token = generateToken();
        
        const sessionQuery = 'INSERT INTO user_sessions (user_id, token) VALUES (?, ?)';
        db.query(sessionQuery, [userId, token], (err) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Database error' }));
            return;
          }
          
          res.writeHead(200);
          res.end(JSON.stringify({ token }));
        });
      });
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid request body' }));
    }
  });
}

// Handle user logout
function handleLogout(req, res) {
  const token = req.headers['authorization'];
  if (!token) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Authentication required' }));
    return;
  }

  const query = 'DELETE FROM user_sessions WHERE token = ?';
  db.query(query, [token], (err) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Logged out successfully' }));
  });
}

// Handle GET transactions (modified to use user_id)
function handleGetTransactions(req, res) {
  const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';
  db.query(query, [req.userId], (err, results) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify(results));
  });
}

// Handle POST new transaction (modified to include user_id)
function handleAddTransaction(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { description, amount, type } = JSON.parse(body);
      const query = 'INSERT INTO transactions (user_id, description, amount, type) VALUES (?, ?, ?, ?)';
      db.query(query, [req.userId, description, amount, type], (err, result) => {
        if (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Database error' }));
          return;
        }
        res.writeHead(201);
        res.end(JSON.stringify({ 
          id: result.insertId,
          user_id: req.userId,
          description,
          amount,
          type,
          date: new Date()
        }));
      });
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid request body' }));
    }
  });
}

// Handle DELETE transaction (modified to check user_id)
function handleDeleteTransaction(req, res, id) {
  const query = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';
  db.query(query, [id, req.userId], (err, result) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database error' }));
      return;
    }
    if (result.affectedRows === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Transaction not found or unauthorized' }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Transaction deleted successfully' }));
  });
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 