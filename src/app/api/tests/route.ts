import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QrCode from "qrcode";
export async function GET() {
  try {
    const tests = await prisma.test.findMany({
      include: {
        produk: true,
        testingType: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    console.log(tests);
    return NextResponse.json(tests, { status: 200 });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { message: "Error fetching tests", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { produkId, testingTypeId, startDate, endDate } = await req.json();

    // Validation
    if (!produkId || !testingTypeId || !startDate || !endDate) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create a new test in the database
    const newTest = await prisma.test.create({
      data: {
        produkId,
        testingTypeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    const qrCodeContent = `${process.env.NEXT_PUBLIC_BASE_URL}/tests/${newTest.id}`;

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

    const updatedTest = await prisma.test.update({
      where: { id: newTest.id },
      data: { qrCode },
    });

    return NextResponse.json(
      { message: "Test created successfully!", test: updatedTest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating test:", error.message);
    return NextResponse.json(
      { message: "Failed to create test.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validation
    if (!id) {
      return NextResponse.json(
        { message: "Test ID is required." },
        { status: 400 }
      );
    }

    // Delete the test
    const deletedTest = await prisma.test.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Test deleted successfully!", test: deletedTest },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting test:", error.message);
    return NextResponse.json(
      { message: "Failed to delete test.", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, produkId, testingTypeId, startDate, endDate } =
      await req.json();

    // Validation
    if (!id) {
      return NextResponse.json(
        { message: "Test ID is required for update." },
        { status: 400 }
      );
    }

    // Update the test
    const updatedTest = await prisma.test.update({
      where: { id },
      data: {
        produkId,
        testingTypeId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return NextResponse.json(
      { message: "Test updated successfully!", test: updatedTest },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating test:", error.message);
    return NextResponse.json(
      { message: "Failed to update test.", error: error.message },
      { status: 500 }
    );
  }
}
