"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";

import { ColumnDef } from "@tanstack/react-table";
import { downloadQRCode } from "@/lib/actions";
import ImageUpload from "@/components/image-upload";

// Validation schema using Zod
const testingTypeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama tes harus diisi." })
    .max(50, { message: "Nama tes tidak boleh lebih dari 50 karakter." }),
  description: z
    .string()
    .max(300, { message: "Deskripsi tidak boleh lebih dari 300 karakter." })
    .optional(),
});

type TestingTypeForm = z.infer<typeof testingTypeSchema>;

interface TestingType {
  id: string;
  name: string;
  description?: string;
  qrCode?: string;
  imageUrl?: string;
}

export default function TestingPage() {
  const [testingTypes, setTestingTypes] = useState<TestingType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(""); // Menyimpan URL gambar

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestingTypeForm>({
    resolver: zodResolver(testingTypeSchema),
  });

  const toggleForm = () => setIsOpen(!isOpen);

  const fetchTestingTypes = async () => {
    try {
      const res = await axios.get("/api/testing-type");
      setTestingTypes(res.data);
    } catch (error) {
      console.error("Error fetching testing types:", error);
      toast.error("Gagal mengambil data jenis tes.");
    }
  };

  useEffect(() => {
    fetchTestingTypes();
  }, []);

  const onSubmit = async (data: TestingTypeForm) => {
    console.log(data);
    try {
      const res = await axios.post("/api/testing-type", {
        ...data,
        imageUrl,
      });

      if (res.status === 201) {
        toast.success("Jenis tes berhasil ditambahkan.");
        reset();
        setImageUrl("");
        setIsOpen(false);
        fetchTestingTypes();
      }
    } catch (error) {
      console.error("Error adding testing type:", error);
      toast.error("Gagal menambahkan jenis tes.");
    }
  };

  const deleteTestingType = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jenis tes ini?")) return;

    try {
      const res = await axios.delete("/api/testing-type", { data: { id } });

      if (res.status === 200) {
        toast.success("Jenis tes berhasil dihapus.");
        fetchTestingTypes();
      }
    } catch (error) {
      console.error("Error deleting testing type:", error);
      toast.error("Gagal menghapus jenis tes.");
    }
  };

  // Table Columns
  const columns: ColumnDef<TestingType>[] = [
    {
      header: () => <div className="flex justify-center">Gambar</div>,
      accessorKey: "imageUrl",
      cell: ({ row }) =>
        row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt={`Image for ${row.original.name}`}
            width={100}
            height={100}
            className="rounded-md mx-auto"
          />
        ) : (
          <span className="text-muted-foreground text-center italic flex justify-center">
            Tidak ada gambar
          </span>
        ),
    },

    {
      header: () => (
        <span className="font-bold text-center flex justify-center">Nama</span>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <span className="text-gray-700 text-md font-semibold">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      header: () => (
        <span className="font-bold text-center flex justify-center">
          Deskripsi
        </span>
      ),
      accessorKey: "description",
      cell: ({ getValue }) => {
        const description = getValue() || ""; // Pastikan description selalu berupa string
        const maxLength = 50; // Tentukan panjang maksimum deskripsi yang ingin ditampilkan
        const displayDescription =
          typeof description === "string" && description.length > maxLength
            ? description.slice(0, maxLength) + "..." // Memotong teks dan menambahkan "..."
            : description || ""; // Pastikan selalu mengembalikan string

        return (
          <div className="flex justify-center">
            <span className="text-gray-700 w-full text-md text-center truncate">
              {displayDescription as string}
            </span>
          </div>
        );
      },
    },

    {
      header: () => (
        <span className="font-bold text-center flex justify-center">
          QR Code
        </span>
      ),
      accessorKey: "qrCode",
      cell: ({ row }) =>
        row.original.qrCode ? (
          <div className="flex flex-col items-center justify-center">
            <Image
              src={row.original.qrCode}
              alt={`QR Code for ${row.original.name}`}
              width={100}
              height={100}
            />{" "}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadQRCode(row.original.qrCode!, row.original.name)
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
            <Link href={`/testing/${row.original.id}`}>Detail</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteTestingType(row.original.id)}
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
          Kelola Jenis Tes
        </h1>
        <Button onClick={toggleForm}>{isOpen ? "Tutup" : "Tambah"}</Button>
      </div>

      {isOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Tambah Jenis Tes
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col space-y-4 p-4 border-2 rounded-md">
                <Input placeholder="Nama Tes" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
                <Textarea
                  placeholder="Deskripsi"
                  {...register("description")}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="max-w-md mx-auto p-4 border-2 rounded-md flex justify-center items-center">
                <ImageUpload
                  folder="testing-types"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  onRemove={() => setImageUrl("")}
                  disabled={false}
                />
              </div>
            </div>
            <div className="w-full ">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 mx-auto"
              >
                Tambah Jenis Tes
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Daftar Jenis Tes
        </h2>
        <DataTable columns={columns} data={testingTypes} />
      </div>
    </div>
  );
}
