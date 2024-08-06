// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env
const noteRouter = require('./models/note');  // Import the note routes

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve static files from 'dist' directory


// MongoDB connection setup
const url = process.env.MONGODB_URI;

if (!url) {
  console.error('Error: MONGODB_URI is not defined.');
  process.exit(1); // Exit the process with an error code
}

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Route to serve a simple HTML page
app.get('/', (request, response) => {
  console.log('GET /');
  response.send('<h1>Hello World!</h1>');
});

// Use the note routes
app.use(noteRouter);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
