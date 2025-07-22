import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return new Response(JSON.stringify({ message: "Invalid username or password" }), { status: 401 });
  }
  // In a real app, set a cookie or session here
  return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
} 