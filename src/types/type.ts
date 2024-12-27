// src/types/type.ts

export interface Produk {
  id: string;
  nama: string;
  deskripsi?: string;
  qrCode?: string;
}

export interface TestingType {
  id: string;
  name: string;
  description?: string;
  qrCode?: string;
  imageUrl?: string;
}
