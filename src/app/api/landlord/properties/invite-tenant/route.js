import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Check authentication
    const currentUserId = request.headers.get('x-user-id');
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is landlord or admin
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(currentUserId) },
      select: { role: true }
    });

    if (!currentUser || (currentUser.role !== 'landlord' && currentUser.role !== 'admin')) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { propertyId, email } = await request.json();

    if (!propertyId || !email) {
      return NextResponse.json(
        { error: "Missing propertyId or email" },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if user is already a member of this property
      const existingMembership = await prisma.membership.findFirst({
        where: {
          userId: existingUser.id,
          propertyId: propertyId,
        },
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "User is already a member of this property" },
          { status: 400 }
        );
      }
    }

    // Generate unique invitation token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        token,
        email,
        propertyId,
        invitedById: parseInt(currentUserId),
        expiresAt,
      },
    });

    // Generate invite link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/invite/${token}`;

    return NextResponse.json({
      message: "Invitation created successfully",
      inviteLink,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
} 