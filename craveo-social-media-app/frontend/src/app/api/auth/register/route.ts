
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password, fullName, username } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Generate mock user data (replace with database call in production)
    const mockUser = generateMockUser({ email, password, fullName, username });

    return NextResponse.json({
      success: true,
      user: mockUser.user,
      token: mockUser.token,
      message: 'Registration successful. Welcome to Craveo!'
    }, { status: 201 }); // 201 Created status

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  return NextResponse.json({
    message: 'Craveo User Registration API',
    endpoint: '/api/auth/register',
    method: 'POST',
    requiredFields: ['email', 'password'],
    optionalFields: ['fullName', 'username'],
    status: 'active',
    version: '1.0.0'
  });
}


interface RegistrationData {
  email: string;
  password: string;
  fullName?: string;
  username?: string;
}

interface MockUser {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatar: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

/**
 * Generate mock user data for development
 * Replace with database integration in production
 */
function generateMockUser(data: RegistrationData): MockUser {
  const timestamp = Date.now();
  const userId = `user_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate username from email if not provided
  const username = data.username || data.email.split('@')[0].toLowerCase();
  
  // Generate full name if not provided
  const fullName = data.fullName || 'New User';
  
  // Default avatar selection
  const avatars = [
    '/images/persons/person1.png',
    '/images/persons/person2.png',
    '/images/persons/person3.png',
    '/images/persons/person4.png',
    '/images/persons/person5.png'
  ];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  return {
    user: {
      id: userId,
      email: data.email.toLowerCase(),
      username: username.toLowerCase().replace(/\s+/g, '_'),
      fullName: fullName,
      avatar: randomAvatar,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    token: `mock_jwt_${userId}_${timestamp}`
  };
}