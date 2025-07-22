import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
    }

    // Check if user owns the property that contains this document
    const document = await prisma.document.findFirst({
      where: {
        id: parseInt(documentId)
      },
      include: {
        property: true
      }
    });

    if (!document) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    if (document.property.ownerId !== parseInt(userId)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Delete the document
    await prisma.document.delete({
      where: {
        id: parseInt(documentId)
      }
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ message: "Failed to delete document" }, { status: 500 });
  }
} 