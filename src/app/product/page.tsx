"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import toast from "react-hot-toast";
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
      toast.error("Gagal mengambil data produk.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a product
  const addProduct = async () => {
    if (!nama) {
      toast.error("Nama produk harus diisi.");
      return;
    }

    try {
      const res = await axios.post("/api/products", { nama, deskripsi });
      if (res.status === 201) {
        toast.success("Produk berhasil ditambahkan.");
        setNama("");
        setDeskripsi("");
        toggleForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Gagal menambahkan produk.");
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
        toast.success("Produk berhasil dihapus.");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Gagal menghapus produk.");
    }
  };

  // Define columns for React Table
  const columns: ColumnDef<Product>[] = [
    {
      id: "id",
      header: () => (
        <span className="font-boldxt-center flex justify-center">No</span>
      ),
      cell: ({ row }) => (
        <span className="flex justify-center">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "nama",
      header: () => (
        <span className="font-bold text-center flex justify-center">Nama</span>
      ),
      cell: ({ row }) => (
        <span className="font-bold flex justify-center">
          {row.original.nama}
        </span>
      ),
    },
    {
      accessorKey: "deskripsi",
      header: () => (
        <span className="font-bold text-center flex justify-center">
          Deskripsi
        </span>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <span className="text-gray-700 text-md">
            {row.original.deskripsi
              ? row.original.deskripsi.slice(0, 50) +
                (row.original.deskripsi.length > 50 ? "..." : "")
              : "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "qrCode",
      header: () => (
        <span className="font-bold text-center flex justify-center">
          QR Code
        </span>
      ),
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
      header: () => (
        <span className="font-bold text-center flex justify-center">Aksi</span>
      ),
      cell: ({ row }) => (
        <div className="space-x-2 flex justify-center">
          <Button variant={"outline"}>
            <Link href={`/product/${row.original.id}`}>Detail</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteProduct(row.original.id)}
          >
            Hapus
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
        {/* Tampilkan daftar untuk mobile */}
        <div className="block md:hidden">
          {products.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="border-b py-4"
            >
              <h3 className="font-semibold mb-2">{product.nama}</h3>
              <p className="text-sm">{product.deskripsi}</p>
            </Link>
          ))}
        </div>

        {/* Tampilkan tabel untuk desktop */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={products} />
        </div>
      </div>
    </div>
  );
}
