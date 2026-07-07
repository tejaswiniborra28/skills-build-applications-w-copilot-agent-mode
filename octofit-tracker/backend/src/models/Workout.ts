import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  targetCalories: number;
  exercises: string[];
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['cardio', 'strength', 'flexibility', 'mixed'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    duration: {
      type: Number,
      required: true,
      min: 5,
    },
    targetCalories: {
      type: Number,
      required: true,
      min: 0,
    },
    exercises: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
