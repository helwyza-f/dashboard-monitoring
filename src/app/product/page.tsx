"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { downloadQRCode } from "@/lib/actions";
import Link from "next/link";

interface Product {
  id: string;
  nama: string;
  deskripsi?: string;
  qrCode?: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => setIsOpen(!isOpen);

  // Fetch data from the server
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data produk.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a product
  const addProduct = async () => {
    if (!nama) {
      toast({
        title: "Error",
        description: "Nama produk harus diisi.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post("/api/products", { nama, deskripsi });
      if (res.status === 201) {
        toast({
          title: "Success",
          description: "Produk berhasil ditambahkan.",
        });
        setNama("");
        setDeskripsi("");
        toggleForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan produk.",
        variant: "destructive",
      });
    }
  };

  // Delete a product
  const deleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const res = await axios.delete("/api/products", {
        data: { id },
      });
      if (res.status === 200) {
        toast({ title: "Deleted", description: "Produk berhasil dihapus." });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus produk.",
        variant: "destructive",
      });
    }
  };

  // Define columns for React Table
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nama",
      header: "Nama",
    },
    {
      accessorKey: "deskripsi",
      header: "Deskripsi",
      cell: ({ row }) => row.original.deskripsi || "-",
    },
    {
      accessorKey: "qrCode",
      header: "QR Code",
      cell: ({ row }) =>
        row.original.qrCode ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              src={row.original.qrCode}
              alt={`QR Code for ${row.original.nama}`}
              className="w-24 h-24"
              width={100}
              height={100}
            />{" "}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadQRCode(row.original.qrCode!, row.original.nama)
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
      header: "Aksi",
      cell: ({ row }) => (
        <div className="space-x-2 flex justify-center">
          <Button
            variant="destructive"
            onClick={() => deleteProduct(row.original.id)}
          >
            Hapus
          </Button>
          <Button variant={"outline"}>
            <Link href={`/product/${row.original.id}`}>Detail</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold mb-6 text-green-600">
          Kelola Produk
        </h1>
        <Button onClick={toggleForm}>{isOpen ? "Tutup" : "Tambah"}</Button>
      </div>

      {/* Form Tambah Produk */}
      {isOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Tambah Produk
          </h2>
          <div className="space-y-4">
            <Input
              placeholder="Nama Produk"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <Textarea
              placeholder="Deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
            <Button
              onClick={addProduct}
              className="bg-green-500 hover:bg-green-600"
            >
              Tambah Produk
            </Button>
          </div>
        </div>
      )}

      {/* Daftar Produk */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Daftar Produk
        </h2>
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
