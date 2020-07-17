import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import fileupload from 'express-fileupload';
import chalk from 'chalk';

// Local imports
import connectDb from './config/db';
import errorHandler from './middleware/error';

// enviroment variables
const PORT = process.env.PORT || 5000;

// load env vars
dotenv.config();

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
import projects from './routes/projects';
import tasks from './routes/tasks';
import auth from './routes/auth';

// mount routers
app.use('/api/v1/projects', projects);
app.use('/api/v1/tasks', tasks);
app.use('/api/v1/auth', auth);

// Error handler middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    chalk.cyan.bold(
      `App in ${process.env.NODE_ENV}, listening on port ${PORT}!`,
    ),
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error, promise) => {
  console.error(chalk.bold.redBright(`Unhandled error ${error.message}`));
  // Close server & exit process
  server.close(() => process.exit(1));
});
