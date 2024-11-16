import { NextResponse } from 'next/server';

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

export async function POST(request) {
  try {
    const { query } = await request.json();

    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition info');
    }

    const data = await response.json();
    
    // Extract relevant information from the Nutritionix response
    const foodInfo = data.foods[0];
    const nutritionInfo = {
      name: foodInfo.food_name,
      calories: foodInfo.nf_calories,
      protein: foodInfo.nf_protein,
      carbs: foodInfo.nf_total_carbohydrate,
      fat: foodInfo.nf_total_fat,
      serving_qty: foodInfo.serving_qty,
      serving_unit: foodInfo.serving_unit,
    };

    return NextResponse.json(nutritionInfo);
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    return NextResponse.json({ error: 'Failed to fetch nutrition info' }, { status: 500 });
  }
}