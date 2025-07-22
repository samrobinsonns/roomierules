import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // TODO: Replace with real session/cookie logic
    // For now, we'll check if there's a user ID in the request headers
    // This is a temporary solution until proper session management is implemented
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(null, { status: 401 });
    }

    const url = new URL(req.url, 'http://localhost');
    const withMemberships = url.searchParams.get('memberships') === '1';

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        memberships: withMemberships ? {
          include: {
            household: {
              select: { id: true, name: true, inviteCode: true }
            },
            property: {
              select: { id: true, name: true, addressLine1: true, city: true }
            }
          }
        } : false,
      },
    });

    if (!user) {
      return new Response(null, { status: 401 });
    }

    return new Response(JSON.stringify(user), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error in /api/me:', error);
    return new Response(null, { status: 500 });
  }
} 