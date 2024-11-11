import mongoose from 'mongoose';

const FoodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodName: {
    type: String,
    required: [true, 'Please provide a food name'],
    maxlength: [100, 'Food name cannot be more than 100 characters'],
  },
  nutritionInfo: {
    calories: {
      type: Number,
      required: [true, 'Please provide calorie information'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      required: [true, 'Please provide protein information'],
      min: [0, 'Protein cannot be negative'],
    },
    carbs: {
      type: Number,
      required: [true, 'Please provide carbohydrate information'],
      min: [0, 'Carbohydrates cannot be negative'],
    },
    fat: {
      type: Number,
      required: [true, 'Please provide fat information'],
      min: [0, 'Fat cannot be negative'],
    },
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid URL for the food image'
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.FoodLog || mongoose.model('FoodLog', FoodLogSchema);
