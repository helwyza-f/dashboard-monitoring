import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import QRCODE from "./components/qr-code";

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
  const totalTests = testingType.tests.length;
  const completedTests = testingType.tests.filter(
    (test: Test) => test.status === "completed"
  ).length;
  const inProgressTests = totalTests - completedTests;
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
              <p className="text-lg">{testingType.description || "-"}</p>
            </div>

            {testingType.imageUrl && (
              <div className="mt-4 flex flex-col items-center justify-center">
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
        {/* Statistics and Tests List */}
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-sm">Total Tests</p>
              <p className="text-2xl font-bold text-green-600">{totalTests}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {completedTests}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {inProgressTests}
              </p>
            </div>
          </div>
          {/* Tests List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Daftar Test
            </h2>
            <div className="space-y-4">
              {testingType.tests.length > 0 ? (
                testingType.tests.map((test: Test) => (
                  <div
                    key={test.id}
                    className="border p-4 rounded-lg hover:border-green-500 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-green-600">
                          {test.produk.nama}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(test.startDate).toLocaleDateString("id-ID")}{" "}
                          - {new Date(test.endDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          test.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {test.status === "completed"
                          ? "Selesai"
                          : "Dalam Proses"}
                      </span>
                    </div>
                    <Link href={`/tests/${test.id}`}>
                      <Button
                        variant="link"
                        className="text-green-600 hover:text-green-700 p-0 h-auto mt-2"
                      >
                        Lihat Detail →
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center italic">
                  Belum ada test untuk jenis test ini
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
