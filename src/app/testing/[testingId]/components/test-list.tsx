"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Test {
  id: string;
  status: string;
  produk: {
    nama: string;
  };
  startDate: Date;
  endDate: Date;
}

interface TestListProps {
  tests: Test[];
}

const TestsPerPage = 5;

export default function TestList({ tests }: TestListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tests.length / TestsPerPage);

  const indexOfLastTest = currentPage * TestsPerPage;
  const indexOfFirstTest = indexOfLastTest - TestsPerPage;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Daftar Test</h2>
      <div className="space-y-4">
        {currentTests.length > 0 ? (
          currentTests.map((test: Test) => (
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
              <Button
                variant="link"
                className="text-green-600 hover:text-green-700 p-0 h-auto mt-2"
              >
                Lihat Detail →
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center italic">
            Belum ada test untuk jenis test ini
          </p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
