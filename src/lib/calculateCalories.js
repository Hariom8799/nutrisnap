function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }
  
  function calculateTDEE(bmr, activityLevel) {
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly active': 1.375,
      'moderately active': 1.55,
      'very active': 1.725,
      'extra active': 1.9
    };
  
    return bmr * activityMultipliers[activityLevel];
  }
  
  function calculateDailyCalories(weight, height, age, gender, activityLevel, goal) {
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
  
    switch (goal) {
      case 'lose weight':
        return Math.round(tdee - 500); // 500 calorie deficit
      case 'gain weight':
        return Math.round(tdee + 500); // 500 calorie surplus
      default:
        return Math.round(tdee); // maintain weight
    }
  }
  
  console.log(calculateDailyCalories(70, 175, 30, 'male', 'moderately active', 'lose weight'));