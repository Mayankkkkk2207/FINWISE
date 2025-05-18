const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234567890'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        console.log('Connection details:', {
            host: 'localhost',
            user: 'root',
            password: '1234567890'
        });
        return;
    }
    console.log('Successfully connected to MySQL!');
    
    // Try to create database
    connection.query('CREATE DATABASE IF NOT EXISTS finwise_db', (err) => {
        if (err) {
            console.error('Error creating database:', err);
        } else {
            console.log('Database created or already exists');
        }
        connection.end();
    });
}); 