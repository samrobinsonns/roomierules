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

    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ message: "Missing userId" }), { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === parseInt(currentUserId)) {
      return new Response(JSON.stringify({ message: "Cannot delete your own account" }), { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });
    
    return new Response(JSON.stringify({ message: "User deleted" }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
} 