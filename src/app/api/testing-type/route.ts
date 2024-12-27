import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QrCode from "qrcode";
import { supabase } from "@/lib/supabase";

// GET: Retrieve all testing types
export async function GET() {
  const testingTypes = await prisma.testingType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(testingTypes);
}

export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const body = await req.json();
    // console.log("Received data:", body);

    // Destructure the incoming data
    const { name, description, imageUrl } = body;

    // Input validation
    if (!name) {
      console.error("Validation error: Name is required");
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create the initial testing type in the database
    const testingType = await prisma.testingType.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    // console.log("Created testing type:", testingType);

    // Generate QR Code content based on the `id`
    const qrCodeContent = `${process.env.NEXT_PUBLIC_BASE_URL}/testing/${testingType.id}`;
    // console.log("QR Code content:", qrCodeContent);

    // Generate QR Code
    let qrCode: string;
    try {
      qrCode = await QrCode.toDataURL(qrCodeContent);
    } catch (qrError) {
      console.error("Error generating QR code:", qrError);
      return NextResponse.json(
        { error: "Failed to generate QR code" },
        { status: 500 }
      );
    }

    // Update the `qrCode` field in the database
    const updatedTestingType = await prisma.testingType.update({
      where: { id: testingType.id },
      data: { qrCode },
    });

    // console.log("Updated testing type with QR code:", updatedTestingType);

    // Respond with the created and updated testing type
    return NextResponse.json(
      {
        message: "Testing type created successfully with QR code",
        data: updatedTestingType,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log and handle unexpected errors
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error occurred" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a testing type
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Ambil data dari database untuk mendapatkan imageUrl
    const testingType = await prisma.testingType.findUnique({
      where: { id },
    });

    if (!testingType) {
      return NextResponse.json(
        { error: "Testing type not found" },
        { status: 404 }
      );
    }

    // Hapus file dari Supabase jika imageUrl tersedia
    if (testingType.imageUrl) {
      const baseUrl =
        "https://crmsgchfvmltrwgnvszr.supabase.co/storage/v1/object/public/dashboard/";
      const filePath = decodeURIComponent(
        testingType.imageUrl.replace(baseUrl, "")
      );

      const { error: deleteError } = await supabase.storage
        .from("dashboard")
        .remove([filePath]);

      if (deleteError) {
        console.error("Error deleting file from Supabase:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete associated image file" },
          { status: 500 }
        );
      }
    }

    // Hapus data dari database
    await prisma.testingType.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting testing type:", error);
    return NextResponse.json(
      { error: "Failed to delete testing type" },
      { status: 500 }
    );
  }
}
