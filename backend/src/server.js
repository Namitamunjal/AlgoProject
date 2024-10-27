const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const router = require('./routes/auth');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = 5000;

// CORS settings
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
  try {
    //connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');

      app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
      });
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
  }
};

startServer();

app.use('/', router);

// app.get('/', (req, res) => {
//   return res.json({ message: "Success! You are authenticated." });
// });