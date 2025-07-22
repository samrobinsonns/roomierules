import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
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
  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });
  return new Response(JSON.stringify({ message: "User registered" }), { status: 201 });
} 