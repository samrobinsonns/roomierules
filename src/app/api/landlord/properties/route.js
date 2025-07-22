import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');
    console.log('GET /api/landlord/properties - userId from header:', userId);
    
    if (!userId) {
      console.log('GET /api/landlord/properties - No userId in header, returning 401');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    console.log('GET /api/landlord/properties - User found:', user ? { id: user.id, username: user.username, role: user.role } : 'null');
    
    if (!user) {
      console.log('GET /api/landlord/properties - User not found, returning 401');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const where = user.role === 'admin' ? {} : { ownerId: parseInt(userId) };
    console.log('GET /api/landlord/properties - Query where clause:', where);
    
    const properties = await prisma.property.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    
    console.log('GET /api/landlord/properties - Found properties count:', properties.length);
    // Add invite links to invitations
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const propertiesWithLinks = properties.map(property => ({
      ...property,
      invitations: property.invitations.map(invite => ({
        ...invite,
        inviteLink: `${baseUrl}/invite/${invite.token}`,
      })),
    }));
    return NextResponse.json(propertiesWithLinks);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id');
    console.log('POST /api/landlord/properties - userId from header:', userId);
    
    if (!userId) {
      console.log('POST /api/landlord/properties - No userId in header, returning 401');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    console.log('POST /api/landlord/properties - FormData keys:', Array.from(formData.keys()));
    
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
      ownerId: parseInt(userId),
    };
    
    console.log('POST /api/landlord/properties - Property data:', propertyData);
    // Create property
    const property = await prisma.property.create({
      data: propertyData,
    });
    // Handle document uploads (simplified - in production you'd upload to cloud storage)
    const documents = formData.getAll("documents");
    if (documents.length > 0) {
      const documentData = documents.map(doc => ({
        name: doc.name,
        filename: doc.name, // In production, this would be the stored filename
        fileType: doc.type,
        fileSize: doc.size,
        propertyId: property.id,
      }));
      await prisma.document.createMany({
        data: documentData,
      });
    }
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
} 