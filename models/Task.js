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

// Static method to get the completed percentage of all tasks inside a project
TaskSchema.statics.getCompletedPercentage = async function (projectId) {
  const aggregatedObj = await this.aggregate([
    { $match: { project: projectId } },
    {
      $group: {
        _id: '$project',
        totalCompleted: { $sum: { $cond: ['$finished', 1, 0] } },
        totalCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: '$project',
        completedPercentage: {
          $multiply: [{ $divide: ['$totalCompleted', '$totalCount'] }, 100],
        },
      },
    },
  ]);
  try {
    await this.model('Project').findByIdAndUpdate(projectId, {
      completedPercentage: parseFloat(
        aggregatedObj[0].completedPercentage
      ).toFixed(2),
    });
  } catch (error) {}
};

// Call getCompletedPercentage after save and before delete

TaskSchema.post('save', function (next) {
  this.constructor.getCompletedPercentage(this.project);
});

TaskSchema.pre('remove', function (next) {
  this.constructor.getCompletedPercentage(this.project);
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
