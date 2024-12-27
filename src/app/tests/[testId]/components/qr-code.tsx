"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { downloadQRCode } from "@/lib/actions";

interface QRCODEProps {
  qrCode: string;
  nama: string;
}

export default function QRCODE({ qrCode, nama }: QRCODEProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        src={qrCode}
        alt={`QR Code ${nama}`}
        width={200}
        height={200}
        className="rounded-lg"
      />
      <Button variant="outline" onClick={() => downloadQRCode(qrCode!, nama)}>
        Download QR Code
      </Button>
    </div>
  );
}
