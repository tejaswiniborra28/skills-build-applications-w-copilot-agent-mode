import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: Date;
  description?: string;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['running', 'cycling', 'swimming', 'weightlifting', 'yoga', 'other'],
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
