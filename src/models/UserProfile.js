import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    min: [13, 'User must be at least 13 years old'],
    max: [120, 'Age cannot exceed 120 years'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  height: {
    type: Number,
    min: [50, 'Height must be at least 50 cm'],
    max: [300, 'Height cannot exceed 300 cm'],
  },
  weight: {
    type: Number,
    min: [20, 'Weight must be at least 20 kg'],
    max: [500, 'Weight cannot exceed 500 kg'],
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active'],
  },
  goal: {
    type: String,
    enum: ['lose weight', 'maintain weight', 'gain weight'],
  },
  dailyCalorieGoal: {
    type: Number,
    min: [1000, 'Daily calorie goal must be at least 1000'],
    max: [10000, 'Daily calorie goal cannot exceed 10000'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);