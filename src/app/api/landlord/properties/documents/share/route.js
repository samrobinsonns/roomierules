import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { documentId, tenantIds, propertyId } = await req.json();

    if (!documentId || !tenantIds || !propertyId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user owns the property
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: parseInt(userId)
      }
    });

    if (!property) {
      return NextResponse.json({ message: "Property not found or access denied" }, { status: 404 });
    }

    // Check if document belongs to this property
    const document = await prisma.document.findFirst({
      where: {
        id: parseInt(documentId),
        propertyId: propertyId
      }
    });

    if (!document) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    // Verify that all tenant IDs are actually tenants of this property
    const validTenants = await prisma.membership.findMany({
      where: {
        userId: {
          in: tenantIds.map(id => parseInt(id))
        },
        propertyId: propertyId,
        role: 'tenant'
      }
    });

    if (validTenants.length !== tenantIds.length) {
      return NextResponse.json({ message: "Some tenants are not valid for this property" }, { status: 400 });
    }

    // For now, we'll just log the sharing action
    // In a real app, you might:
    // 1. Create a DocumentShare record in the database
    // 2. Send notifications to tenants
    // 3. Generate share links
    // 4. Track access permissions

    console.log(`Document ${documentId} shared with tenants:`, tenantIds);

    return NextResponse.json({ 
      message: "Document shared successfully",
      sharedWith: tenantIds.length,
      documentId: documentId
    });
  } catch (error) {
    console.error('Error sharing document:', error);
    return NextResponse.json({ message: "Failed to share document" }, { status: 500 });
  }
} 