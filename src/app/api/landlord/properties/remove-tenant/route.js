import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { propertyId, userId } = await request.json();

    // Find and delete the membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: userId,
        propertyId: propertyId,
        role: "tenant",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Tenant not found in this property" },
        { status: 404 }
      );
    }

    await prisma.membership.delete({
      where: { id: membership.id },
    });

    return NextResponse.json({ message: "Tenant removed successfully" });
  } catch (error) {
    console.error("Error removing tenant:", error);
    return NextResponse.json(
      { error: "Failed to remove tenant" },
      { status: 500 }
    );
  }
} 