const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

// Environment variable configurations
require('dotenv').config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Review Schema
const reviewSchema = new mongoose.Schema({
  reviewerName: String,
  cafeName: String,
  reviewContent: String,
  reviewImage: String,  // Store the base64 image
  reviewRating: Number,
  timestamp: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// Routes
app.post('/api/reviews', async (req, res) => {
  const { reviewerName, cafeName, reviewContent, reviewImage, reviewRating } = req.body;
  
  try {
    const newReview = new Review({
      reviewerName,
      cafeName,
      reviewContent,
      reviewImage,
      reviewRating,
      timestamp: new Date()
    });

    const savedReview = await newReview.save();
    res.status(200).json(savedReview);  // Return the saved review to the frontend
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).send('Error saving review');
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);  // Send all reviews to the frontend
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).send('Error fetching reviews');
  }
});

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'client')));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
