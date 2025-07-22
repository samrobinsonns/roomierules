import { PrismaClient } from '../../../../generated/prisma/index.js';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

// Generate a unique invite code
function generateInviteCode() {
  return randomBytes(4).toString('hex').toUpperCase();
}

export async function GET() {
  // TODO: Replace with real session logic
  const email = 'samrobinsonns@gmail.com';
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: {
          household: {
            include: {
              memberships: {
                include: {
                  user: {
                    select: { id: true, username: true, email: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  // Filter households where user is landlord
  const landlordHouseholds = user.memberships
    .filter(m => m.role === 'landlord')
    .map(m => m.household);

  return new Response(JSON.stringify(landlordHouseholds), { status: 200 });
}

export async function POST(req) {
  const { name } = await req.json();
  if (!name) {
    return new Response(JSON.stringify({ message: "Missing household name" }), { status: 400 });
  }

  // TODO: Replace with real session logic
  const email = 'samrobinsonns@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  // Generate unique invite code
  let inviteCode;
  let household;
  do {
    inviteCode = generateInviteCode();
    household = await prisma.household.findUnique({ where: { inviteCode } });
  } while (household);

  // Create household and add user as landlord
  const newHousehold = await prisma.household.create({
    data: {
      name,
      inviteCode,
      memberships: {
        create: {
          userId: user.id,
          role: 'landlord'
        }
      }
    }
  });

  return new Response(JSON.stringify(newHousehold), { status: 201 });
} 