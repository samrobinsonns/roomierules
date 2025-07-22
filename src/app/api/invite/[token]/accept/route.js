import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { token } = params;
    const { username, password } = await request.json();

    if (!token || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find invitation by token
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        property: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 410 }
      );
    }

    // Check if invitation has already been accepted
    if (invitation.status === 'accepted') {
      return NextResponse.json(
        { error: "Invitation has already been accepted" },
        { status: 409 }
      );
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user account
    const user = await prisma.user.create({
      data: {
        username,
        email: invitation.email,
        passwordHash,
        role: 'tenant',
      },
    });

    // Create membership
    await prisma.membership.create({
      data: {
        userId: user.id,
        propertyId: invitation.propertyId,
        role: 'tenant',
      },
    });

    // Update invitation status
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: 'accepted',
        invitedUserId: user.id,
      },
    });

    return NextResponse.json({
      message: "Account created successfully",
      userId: user.id,
      username: user.username,
      role: user.role,
      propertyName: invitation.property.name,
    }, { status: 201 });

  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
} 