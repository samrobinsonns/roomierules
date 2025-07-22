import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const property = await prisma.property.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        documents: true,
        memberships: {
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
        },
        invitations: {
          include: {
            invitedUser: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }
    // Only allow owner or admin
    if (user.role !== 'admin' && property.ownerId !== parseInt(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Add invite links to invitations
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const invitationsWithLinks = property.invitations.map(invite => ({
      ...invite,
      inviteLink: `${baseUrl}/invite/${invite.token}`,
    }));
    return NextResponse.json({
      ...property,
      invitations: invitationsWithLinks,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const formData = await request.formData();
    
    // Extract property data
    const propertyData = {
      name: formData.get("name"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || null,
      city: formData.get("city"),
      county: formData.get("county"),
      postcode: formData.get("postcode"),
      propertyType: formData.get("propertyType"),
      bedrooms: parseInt(formData.get("bedrooms")),
      bathrooms: parseInt(formData.get("bathrooms")),
      description: formData.get("description") || null,
    };

    // Update property
    const property = await prisma.property.update({
      where: { id: parseInt(resolvedParams.id) },
      data: propertyData,
    });

    // Handle new document uploads
    const documents = formData.getAll("documents");
    if (documents.length > 0) {
      const documentData = documents.map(doc => ({
        name: doc.name,
        filename: doc.name,
        fileType: doc.type,
        fileSize: doc.size,
        propertyId: parseInt(resolvedParams.id),
      }));

      await prisma.document.createMany({
        data: documentData,
      });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    // Delete property (documents will be deleted automatically due to cascade)
    await prisma.property.delete({
      where: { id: parseInt(resolvedParams.id) },
    });

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
} 