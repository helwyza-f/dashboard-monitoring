import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import QRCODE from "./components/qr-code";
import Status from "./components/status";

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      produk: true,
      testingType: true,
    },
  });
  if (!test) {
    notFound();
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600">Detail Test</h1>
        <Link href="/tests">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Test Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Informasi Test
          </h2>
          <div className="space-y-4">
            <Status initialStatus={test.status} testId={test.id} />
            <div>
              <p className="text-sm text-gray-500">Periode Test</p>
              <p className="text-lg">
                {new Date(test.startDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(test.endDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {test.qrCode && (
              <QRCODE qrCode={test.qrCode} nama={test.produk.nama} />
            )}
          </div>
        </div>
        {/* Product and Testing Type Info */}
        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Informasi Produk
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama Produk</p>
                <p className="text-lg font-medium">{test.produk.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deskripsi Produk</p>
                <p className="text-lg">{test.produk.deskripsi || "-"}</p>
              </div>
              <Link href={`/product/${test.produkId}`}>
                <Button variant="link" className="p-0">
                  Lihat Detail Produk →
                </Button>
              </Link>
            </div>
          </div>
          {/* Testing Type Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Informasi Jenis Test
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama Test</p>
                <p className="text-lg font-medium">{test.testingType.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deskripsi Test</p>
                <p className="text-lg">{test.testingType.description || "-"}</p>
              </div>
              <Link href={`/testing/${test.testingTypeId}`}>
                <Button variant="link" className="p-0">
                  Lihat Detail Jenis Test →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
