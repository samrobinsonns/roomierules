import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return new Response(JSON.stringify({ message: "Missing email" }), { status: 400 });
  }
  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });
  return new Response(JSON.stringify({ message: `User ${email} promoted to admin` }), { status: 200 });
} 