import { Document, Model, model, Types, Schema, Query } from 'mongoose';

const TaskSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
});

interface ITaskSchema extends Document {
  name: string;
  description: string;
  createdAt: Date;
  priority: number;
  finished: boolean;
  finishDate: Date;
  project: string;
  getCompletedPercentage(projectId: String): Promise<void>;
}

// Static method to get the completed percentage of all tasks inside a project
TaskSchema.statics.getCompletedPercentage = async function (
  projectId: String,
): Promise<void> {
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
        aggregatedObj[0].completedPercentage,
      ).toFixed(2),
    });
  } catch (error) {}
};

// Document middlewares
// Call getCompletedPercentage after save and before delete
TaskSchema.pre<ITaskSchema>('remove', function (next) {
  this.getCompletedPercentage(this.project);
  next();
});

// Query middlewares
TaskSchema.post<ITaskSchema>('save', function (this: ITaskSchema, next) {
  this.getCompletedPercentage(this.project);
});

export default model<ITaskSchema>('Task', TaskSchema);
