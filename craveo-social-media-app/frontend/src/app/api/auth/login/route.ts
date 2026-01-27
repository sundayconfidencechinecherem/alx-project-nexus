
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

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

    // Generate mock user data (replace with database authentication in production)
    const mockUser = generateMockUser(email);

    return NextResponse.json({
      success: true,
      user: mockUser.user,
      token: mockUser.token,
      message: 'Login successful. Welcome back to Craveo!'
    });

  } catch (error) {
    console.error('Login authentication error:', error);
    
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

/**
 * GET /api/auth/login
 * Returns endpoint information
 */
export async function GET() {
  return NextResponse.json({
    message: 'Craveo User Authentication API',
    endpoint: '/api/auth/login',
    method: 'POST',
    requiredFields: ['email', 'password'],
    status: 'active',
    version: '1.0.0'
  });
}


interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  lastLogin: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Generate mock user data for authentication
 * Replace with database authentication in production
 */
function generateMockUser(email: string): AuthResponse {
  const timestamp = Date.now();
  const userId = `user_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
  const username = email.split('@')[0].toLowerCase();
  
  // Format name from email
  const formattedName = username
    .split(/[._-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
      email: email.toLowerCase(),
      username: username.replace(/\s+/g, '_'),
      fullName: formattedName || 'Craveo User',
      avatar: randomAvatar,
      isVerified: true,
      lastLogin: new Date().toISOString()
    },
    token: `mock_jwt_${userId}_${timestamp}`
  };
}