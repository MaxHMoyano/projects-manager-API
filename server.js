const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDb = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');

// enviroment variables
const PORT = process.env.PORT || 5000;

// load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDb();

// server
const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading and static folder middleware
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));

// routes
const projects = require('./routes/projects');
const tasks = require('./routes/tasks');

// mount routers
app.use('/api/v1/projects', projects);
app.use('/api/v1/tasks', tasks);

// Error handler middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `App in ${process.env.NODE_ENV}, listening on port ${PORT}!`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.error(`Unhandled error ${error.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
