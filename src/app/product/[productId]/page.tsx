import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import QRCODE from "./_components/qr-code";

interface Test {
  id: string;
  status: string;
  testingType: {
    name: string;
  };
  startDate: Date;
  endDate: Date;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await prisma.produk.findUnique({
    where: { id: productId },
    include: {
      tests: {
        include: {
          testingType: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600">{product.nama}</h1>
        <Link href="/product">
          <Button variant="outline">Kembali</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Informasi Produk
          </h2>
          <div className="space-y-4">
            <div>
              <p className=" text-gray-700 text-md">
                {product.deskripsi || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Dibuat</p>
              <p className="text-lg">
                {new Date(product.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {product.qrCode && (
              <QRCODE qrCode={product.qrCode} nama={product.nama} />
            )}
          </div>
        </div>
        {/* Tests List Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Riwayat Test
          </h2>
          <div className="space-y-4">
            {product.tests.length > 0 ? (
              product.tests.map((test: Test) => (
                <div
                  key={test.id}
                  className="border p-4 rounded-lg hover:border-green-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-green-600">
                        {test.testingType.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(test.startDate).toLocaleDateString("id-ID")} -{" "}
                        {new Date(test.endDate).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        test.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {test.status === "completed" ? "Selesai" : "Dalam Proses"}
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
                Belum ada test untuk produk ini
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
