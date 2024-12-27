import QrCode from "qrcode";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const produk = await prisma.produk.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    // console.log(produk);

    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, deskripsi } = body;

    if (!nama) {
      return NextResponse.json(
        { message: "Nama produk harus diisi" },
        { status: 400 }
      );
    }

    // Buat produk baru
    const produk = await prisma.produk.create({
      data: {
        nama,
        deskripsi,
      },
    });

    // Buat URL untuk QR Code
    const qrCodeContent = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${produk.id}`;

    // Generate QR Code as base64
    const qrCode = await QrCode.toDataURL(qrCodeContent, {
      errorCorrectionLevel: "H",
    });

    // Perbarui produk dengan QR Code yang baru dibuat
    const updatedProduk = await prisma.produk.update({
      where: { id: produk.id },
      data: { qrCode },
    });

    return NextResponse.json(updatedProduk, { status: 201 });
  } catch (error) {
    console.error("Error generating QR Code or creating product:", error);
    return NextResponse.json(
      { message: "Error adding product", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID produk harus diisi" },
        { status: 400 }
      );
    }

    await prisma.produk.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Produk berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting product", error },
      { status: 500 }
    );
  }
}
