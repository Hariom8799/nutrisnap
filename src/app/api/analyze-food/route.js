import { NextRequest, NextResponse } from 'next/server';

const foodClasses = {
  0: "Apple Pie",
  1: "Baby Back Ribs",
  2: "Baklava",
  3: "Beef Carpaccio",
  4: "Beef Tartare",
  5: "Beet Salad",
  6: "Beignets",
  7: "Bibimbap",
  8: "Bread Pudding",
  9: "Breakfast Burrito",
  10: "Bruschetta",
  11: "Caesar Salad",
  12: "Cannoli",
  13: "Caprese Salad",
  14: "Carrot Cake",
  15: "Ceviche",
  16: "Cheesecake",
  17: "Cheese Plate",
  18: "Chicken Curry",
  19: "Chicken Quesadilla",
  20: "Chicken Wings",
  21: "Chocolate Cake",
  22: "Chocolate Mousse",
  23: "Churros",
  24: "Clam Chowder",
  25: "Club Sandwich",
  26: "Crab Cakes",
  27: "Creme Brulee",
  28: "Croque Madame",
  29: "Cup Cakes",
  30: "Deviled Eggs",
  31: "Donuts",
  32: "Dumplings",
  33: "Edamame",
  34: "Eggs Benedict",
  35: "Escargots",
  36: "Falafel",
  37: "Filet Mignon",
  38: "Fish and Chips",
  39: "Foie Gras",
  40: "French Fries",
  41: "French Onion Soup",
  42: "French Toast",
  43: "Fried Calamari",
  44: "Fried Rice",
  45: "Frozen Yogurt",
  46: "Garlic Bread",
  47: "Gnocchi",
  48: "Greek Salad",
  49: "Grilled Cheese Sandwich",
  50: "Grilled Salmon",
  51: "Guacamole",
  52: "Gyoza",
  53: "Hamburger",
  54: "Hot and Sour Soup",
  55: "Hot Dog",
  56: "Huevos Rancheros",
  57: "Hummus",
  58: "Ice Cream",
  59: "Lasagna",
  60: "Lobster Bisque",
  61: "Lobster Roll Sandwich",
  62: "Macaroni and Cheese",
  63: "Macarons",
  64: "Miso Soup",
  65: "Mussels",
  66: "Nachos",
  67: "Omelette",
  68: "Onion Rings",
  69: "Oysters",
  70: "Pad Thai",
  71: "Paella",
  72: "Pancakes",
  73: "Panna Cotta",
  74: "Peking Duck",
  75: "Pho",
  76: "Pizza",
  77: "Pork Chop",
  78: "Poutine",
  79: "Prime Rib",
  80: "Pulled Pork Sandwich",
  81: "Ramen",
  82: "Ravioli",
  83: "Red Velvet Cake",
  84: "Risotto",
  85: "Samosa",
  86: "Sashimi",
  87: "Scallops",
  88: "Seaweed Salad",
  89: "Shrimp and Grits",
  90: "Spaghetti Bolognese",
  91: "Spaghetti Carbonara",
  92: "Spring Rolls",
  93: "Steak",
  94: "Strawberry Shortcake",
  95: "Sushi",
  96: "Tacos",
  97: "Takoyaki",
  98: "Tiramisu",
  99: "Tuna Tartare",
  100: "Waffles"
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Invalid file uploaded' }, { status: 400 });
    }

    // Create a new FormData instance for sending to the API
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Your deployed model's URL with the correct endpoint
    const modelUrl = 'https://food-recognition-model.onrender.com/predict';

    console.log('Sending request to model URL:', modelUrl);

    const response = await fetch(modelUrl, {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);

    const analyzedFood = {
      foodName: foodClasses[result.predicted_class] || 'Unknown Food',
      confidence: result.confidence,
    };

    return NextResponse.json(analyzedFood);
  } catch (error) {
    console.error('Error analyzing food:', error);
    return NextResponse.json({ error: 'Failed to analyze food', details: error.message }, { status: 500 });
  }
}



// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     // Parse the request body
//     const { image, fileName } = await request.json();

//     // TODO: Implement actual image analysis model
//     // For now, we'll return a static response

//     // Simulate processing delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     console.log("File name:", fileName);

//     const lastnum = parseInt(fileName.split('.')[0]) % 10

//     let fName;
//     if(lastnum == 1){
//       fName = "French fries"
//     }
//     else if(lastnum == 2){
//       fName = "omelette"
//     }
//     else if(lastnum == 3){
//       fName = "samosa"
//     }
//     else if(lastnum == 4){
//       fName = "Sushi"
//     }
//     else{
//       fName = "Lasagna"
//     }
    
//     // Static response
//     const analyzedFood = {
//       foodName: fName,
//       confidence: 0.95,
//     };

//     // In a real implementation, you would:
//     // 1. Preprocess the image
//     // 2. Pass the preprocessed image to your ML model
//     // 3. Interpret the model's output
//     // 4. Return the results

//     return NextResponse.json(analyzedFood);
//   } catch (error) {
//     console.error('Error analyzing food:', error);
//     return NextResponse.json({ error: 'Failed to analyze food' }, { status: 500 });
//   }
// }