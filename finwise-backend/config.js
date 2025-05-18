const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234567890',
    database: process.env.DB_NAME || 'finwise_db',
    port: process.env.DB_PORT || 3306
};

module.exports = dbConfig; 