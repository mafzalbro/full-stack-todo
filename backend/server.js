const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config();
const path = require('path')

const app = express();


// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors())
app.use(morgan('dev')); // Use morgan for logging

// Routes
app.use('/api', require('./routes/notesRoutes'));

app.use(express.static(path.join(__dirname, '../frontend')))

// // Start the server
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
 // console.log(`Server is running on http://localhost:${PORT}`);
//});

// Export the app as a serverless function
module.exports = app;
