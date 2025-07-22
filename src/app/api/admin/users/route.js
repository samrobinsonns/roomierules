import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Check authentication
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return new Response(JSON.stringify(users), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
} 