import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const testingTypes = await prisma.testingType.findMany({
      include: {
        tests: true,
      },
    });

    const data = testingTypes.map((type) => {
      const imageUrl = type.imageUrl;
      const typeId = type.id;
      const total = type.tests.length;
      const inProgress = type.tests.filter(
        (test) => test.status === "inProgress"
      ).length;
      const finished = type.tests.filter(
        (test) => test.status === "completed"
      ).length;

      return {
        typeId,
        imageUrl,
        name: type.name,
        stats: {
          total,
          inProgress,
          finished,
        },
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
