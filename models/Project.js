const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del proyecto es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede contener mas de 50 caracteres'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'La descripción del proyecto es requerida'],
    maxlength: [500, 'La descripción no puede contener mas de 500 caracteres'],
  },
  priority: {
    type: Number,
    required: [true, 'La prioridad es requerida'],
    min: [1, 'La prioridad minima es uno(1)'],
    max: [3, 'La prioridad maxima es tres(3)'],
  },
  startDate: {
    type: Date,
    required: false,
  },
  estimatedEndDate: {
    type: Date,
    required: [true, 'La fecha estimada de finalización es requerida'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  started: {
    type: Boolean,
    default: false,
    required: false,
  },
  finished: {
    type: Boolean,
    required: false,
    default: false,
  },
  keywords: {
    type: [String],
    required: false,
  },
  type: {
    type: [String],
    required: true,
    enum: ['Personal Experience', 'Work', 'Learning', 'Other'],
  },
});

// Create project slug from the name
ProjectSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });

  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
