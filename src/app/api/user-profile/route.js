import { NextResponse } from 'next/server';
import  connectToDatabase from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const userProfile = await UserProfile.findOne({ userId }).lean();

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const profileData = await request.json();
    await connectToDatabase();

    const userProfile = new UserProfile(profileData);
    await userProfile.save();

    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json({ error: 'Failed to create user profile', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId, ...updateData } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile', details: error.message }, { status: 500 });
  }
}
