const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la tarea es requerida'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  priority: {
    type: Number,
    required: [true, 'La prioridad es requerida'],
    min: 1,
    max: 3,
  },
  finished: {
    type: Boolean,
    default: false,
    required: false,
  },
  finishDate: {
    type: Date,
    required: false,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
