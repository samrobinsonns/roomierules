import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { propertyId, userId } = await request.json();

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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if membership already exists
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: userId,
        propertyId: propertyId,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already assigned to this property" },
        { status: 400 }
      );
    }

    // Create membership
    const membership = await prisma.membership.create({
      data: {
        userId: userId,
        propertyId: propertyId,
        role: "tenant",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error("Error assigning tenant:", error);
    return NextResponse.json(
      { error: "Failed to assign tenant" },
      { status: 500 }
    );
  }
} 