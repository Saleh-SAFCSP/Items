const express = require('express');
require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const ErrorResponse = require('./util/errorResponse');

const app = express();

dotenv.config();

app.use(express.json());

// Connect to the database
connectDB();

app.use('/api/v1', require('./routes/mainRoute'));
app.use('/api/v1/auth', require('./routes/authRoute'));

// Catch 404 to route does not exist and forward it to the error handler
app.use((req, res, next) => {
  return next(new ErrorResponse('Page not found !', 404));
});

// Handle all the errors
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
      .yellow.bold
  )
);
