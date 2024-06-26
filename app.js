const express = require('express')
const cors = require('cors');
const { MONGODB_URL, API_URL, STATIC_IMAGE_URL } = require("./constants/const")
const bankRoutes = require('./routes/bankRoutes')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const mongoose = require("mongoose")
const PORT = process.env.PORT || 9000
const path = require('path');
const dotenv = require('dotenv')

const app = express()

dotenv.config()

// Middleware to parse JSON
app.use(express.json());
// support encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use(STATIC_IMAGE_URL, express.static(path.join(__dirname, 'uploads/banks')));

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch(err => {
  console.error('Error connecting to MongoDB', err)
})

// Set the routers
app.use('/', bankRoutes)
app.use('/', authRoutes)
app.use('/', transactionRoutes)

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT)
})
