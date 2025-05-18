const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// First create connection without database
const initialConnection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password
});

// Read SQL file
const sqlFile = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
const sqlCommands = sqlFile.split(';').filter(cmd => cmd.trim());

// Execute SQL commands
async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');

        // Execute each SQL command
        for (const command of sqlCommands) {
            if (command.trim()) {
                await new Promise((resolve, reject) => {
                    initialConnection.query(command, (err) => {
                        if (err) {
                            console.error('Error executing SQL command:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }
        }

        console.log('Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

// Run initialization
initializeDatabase(); 