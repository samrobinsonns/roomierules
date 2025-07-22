import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
    }
    
    // Return user ID for frontend storage (temporary solution)
    return new Response(JSON.stringify({ 
      message: "Login successful",
      userId: user.id,
      username: user.username,
      role: user.role
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: "Login failed" }), { status: 500 });
  }
} 