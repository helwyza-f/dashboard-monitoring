import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    // Validasi
    if (!id) {
      return NextResponse.json(
        { message: "Test ID is required for update." },
        { status: 400 }
      );
    }

    // Update status test
    const updatedTest = await prisma.test.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      { message: "Test status updated successfully!", test: updatedTest },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update test status.", error: error },
      { status: 500 }
    );
  }
}
