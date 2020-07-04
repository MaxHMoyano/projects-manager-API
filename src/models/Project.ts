import { Document, Model, model, Types, Schema, Query } from 'mongoose';
import slugify from 'slugify';

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del proyecto es requerido'],
      trim: true,
      maxlength: [50, 'El nombre no puede contener mas de 50 caracteres'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'La descripción del proyecto es requerida'],
      maxlength: [
        500,
        'La descripción no puede contener mas de 500 caracteres',
      ],
    },
    completedPercentage: {
      type: Number,
      required: false,
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
    estimatedCompletionDate: {
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
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

interface IProjectSchema extends Document {
  name: string;
  slug: string;
  description: string;
  completedPercentage: number;
  priority: number;
  startDate: Date;
  estimatedCompletionDate: Date;
  started: boolean;
  finished: boolean;
  keywords: string[];
  photo: string;
}

// Create project slug from the name
ProjectSchema.pre<IProjectSchema>('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });

  next();
});

// Cascade delete tasks when a project is deleted

ProjectSchema.pre<IProjectSchema>('remove', async function (next) {
  await this.model('Task').deleteMany({ project: this._id });
  next();
});

// Reverse populate with task virtual

ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false,
});

export default model<IProjectSchema>('Project', ProjectSchema);
