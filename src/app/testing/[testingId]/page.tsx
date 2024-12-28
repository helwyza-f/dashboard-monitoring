import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QRCODE from "./components/qr-code";
import TestList from "./components/test-list";

interface Test {
  id: string;
  status: string;
  produk: {
    nama: string;
  };
  startDate: Date;
  endDate: Date;
}

export default async function TestingTypePage({
  params,
}: {
  params: Promise<{ testingId: string }>;
}) {
  const { testingId } = await params;
  const testingType = await prisma.testingType.findUnique({
    where: { id: testingId },
    include: {
      tests: {
        include: {
          produk: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!testingType) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600">
          {testingType.name}
        </h1>
        <Link href="/testing">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Testing Type Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Informasi Jenis Test
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Deskripsi</p>
              <p className="text-md">{testingType.description || "-"}</p>
            </div>
            {testingType.imageUrl && (
              <div className="mt-5 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500 mb-2">Gambar</p>
                <Image
                  src={testingType.imageUrl}
                  alt={testingType.name}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {testingType.qrCode && (
              <QRCODE qrCode={testingType.qrCode} nama={testingType.name} />
            )}
          </div>
        </div>
        {/* Tests List */}
        <TestList tests={testingType.tests} />
      </div>
    </div>
  );
}
