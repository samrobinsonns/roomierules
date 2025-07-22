import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const currentUserId = request.headers.get('x-user-id');
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Only allow landlords/admins
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(currentUserId) },
      select: { role: true }
    });
    if (!currentUser || (currentUser.role !== 'landlord' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { invitationId } = await request.json();
    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitationId" }, { status: 400 });
    }
    // Only allow revoking if still pending
    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }
    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: "Only pending invitations can be revoked" }, { status: 400 });
    }
    await prisma.invitation.delete({ where: { id: invitationId } });
    return NextResponse.json({ message: "Invitation revoked" });
  } catch (error) {
    console.error("Error revoking invitation:", error);
    return NextResponse.json({ error: "Failed to revoke invitation" }, { status: 500 });
  }
} 