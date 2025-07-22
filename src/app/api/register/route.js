import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }
    
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });
    
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });
    
    // Return user ID for frontend storage (temporary solution)
    return new Response(JSON.stringify({ 
      message: "User registered",
      userId: user.id,
      username: user.username,
      role: user.role
    }), { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ message: "Registration failed" }), { status: 500 });
  }
} 