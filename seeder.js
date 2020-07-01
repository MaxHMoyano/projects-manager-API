const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Project = require('./models/Project');
const Task = require('./models/Task');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const projects = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/projects.json`, 'utf-8')
);

const tasks = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/tasks.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Project.create(projects);
    await Task.create(tasks);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Project.deleteMany();
    await Task.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  deleteData();
}
