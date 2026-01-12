// Load environment variables from .env file
require('dotenv').config();

const app = require('./app');
// const connectDB = require('./config/db');

// const PORT = process.env.PORT || 3000;
// const BIND_HOST = process.env.HOST || '0.0.0.0';
// const PUBLIC_HOST = process.env.SWAGGER_HOST || `${BIND_HOST}:${PORT}`;
// const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB on startup
let isConnected = false;
async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb+srv://yadavhemant9719_db_user:Hemant$9719@cluster0.nt0ymv8.mongodb.net/?appName=Cluster0/lerning', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToMongoDB();
  } 
  next();
});


// Export app for Vercel serverless and other runtimes
module.exports = app;