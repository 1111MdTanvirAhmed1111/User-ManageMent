require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')
const app = express()









// Middlewares
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Configure multer for image upload
// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));





// Server Technical Zone (Connection)
const PORT = process.env.PORT || 5000;


// Mongoose Connection Setup

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Use httpServer instead of app.listen
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err.message));

  