// Load environment variables from .env file
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
const BIND_HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_HOST = process.env.SWAGGER_HOST || `${BIND_HOST}:${PORT}`;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB on startup
let dbConnected = false;
connectDB()
    .then(() => {
        dbConnected = true;
        console.log('✓ MongoDB connected');
        
        // Only listen in local development (not on Vercel serverless)
        if (NODE_ENV === 'development') {
            app.listen(PORT, BIND_HOST, () => {
                console.log(`✓ Server is running on http://${PUBLIC_HOST}`);
            });
        }
    })
    .catch((error) => {
        console.error('✗ MongoDB Connection Error:', error.message);
        if (NODE_ENV === 'development') {
            process.exit(1);
        }
    });

// Export app for Vercel serverless and other runtimes
module.exports = app;