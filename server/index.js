const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const userRoutes = require('./routes/user-routes');
const messageRoutes = require('./routes/message-routes');
const roomRoutes = require('./routes/room-routes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Create an Express application
const app = express();
//Middleware
app.use(express.json());

// Routes 
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});
// User routes
app.use('/api/users', userRoutes);
// Message routes
app.use('/api/messages', messageRoutes);
// Room routes
app.use('/api/rooms', roomRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
