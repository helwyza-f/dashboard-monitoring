"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Test } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { downloadQRCode } from "@/lib/actions";

export interface TestData {
  id: string;
  produk: {
    nama: string;
  };
  testingType: {
    name: string;
  };
  startDate: string;
  endDate: string;
}

interface DataTableProps {
  data: Test[];
  deleteTest: (id: string) => Promise<void>;
}

export default function TestData({ data, deleteTest }: DataTableProps) {
  const [testData, setTestData] = useState<Test[]>(data);
  const router = useRouter();
  useEffect(() => {
    setTestData(data);
  }, [data]);

  // Define columns for React Table
  const columns: ColumnDef<Test>[] = [
    {
      accessorKey: "produk.nama",
      header: "Product Name",
    },
    {
      accessorKey: "testingType.name",
      header: "Testing Type",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) =>
        new Date(row.original.startDate).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) =>
        new Date(row.original.endDate).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status === "inProgress" ? "In Progress" : "Completed",
    },
    {
      accessorKey: "qrCode",
      header: "QR Code",
      cell: ({ row }) =>
        row.original.qrCode ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              src={row.original.qrCode}
              alt={`QR Code for ${row.original.produkId}`}
              className="w-24 h-24"
              width={100}
              height={100}
            />{" "}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadQRCode(row.original.qrCode!, row.original.produkId)
              }
            >
              Download QR
            </Button>
          </div>
        ) : (
          "Tidak ada QR Code"
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="space-x-2 flex justify-center">
          <Button
            variant="destructive"
            onClick={() => deleteTest(row.original.id)}
          >
            Delete
          </Button>
          <Button variant="outline">
            <Link href={`/tests/${row.original.id}`}>Lihat</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-green-600">
        Kelola Data Test
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Daftar Test
        </h2>
        <DataTable columns={columns} data={testData} />
      </div>
    </div>
  );
}
