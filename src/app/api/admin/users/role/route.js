import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Check authentication
    const currentUserId = req.headers.get('x-user-id');
    
    if (!currentUserId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(currentUserId) },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { userId, newRole } = await req.json();
    
    if (!userId || !newRole) {
      return new Response(JSON.stringify({ message: "Missing userId or newRole" }), { status: 400 });
    }

    // Prevent admin from changing their own role
    if (parseInt(userId) === parseInt(currentUserId)) {
      return new Response(JSON.stringify({ message: "Cannot change your own role" }), { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    return new Response(JSON.stringify({ message: "Role updated" }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
} 