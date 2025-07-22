import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: "Invalid token" },
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
            propertyType: true,
            addressLine1: true,
            city: true,
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

    return NextResponse.json({
      id: invitation.id,
      email: invitation.email,
      property: invitation.property,
      expiresAt: invitation.expiresAt,
      status: invitation.status,
    });

  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
} 