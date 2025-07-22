import { PrismaClient } from '../../../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function POST(req) {
  const { userId, householdId } = await req.json();
  if (!userId || !householdId) {
    return new Response(JSON.stringify({ message: "Missing userId or householdId" }), { status: 400 });
  }

  // TODO: Replace with real session logic
  const email = 'samrobinsonns@gmail.com';
  const landlord = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        where: { householdId, role: 'landlord' }
      }
    }
  });

  if (!landlord || landlord.memberships.length === 0) {
    return new Response(JSON.stringify({ message: "Not authorized" }), { status: 403 });
  }

  // Remove the tenant from the household
  await prisma.membership.deleteMany({
    where: {
      userId,
      householdId,
      role: 'tenant'
    }
  });

  return new Response(JSON.stringify({ message: "Tenant removed" }), { status: 200 });
} 