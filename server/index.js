const express = require('express');
const PORT = process.env.PORT || 5000;
// Create an Express application
const app = express();
//Middleware
app.use(express.json());

// Routes 
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
