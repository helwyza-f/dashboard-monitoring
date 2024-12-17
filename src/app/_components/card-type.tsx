"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CardTypeProps {
  testId?: string;
  title: string;
  image: string;
  stats: {
    total: number;
    inProgress: number;
    finished: number;
  };
}

export function CardType({ testId, title, image, stats }: CardTypeProps) {
  return (
    <Card className="relative p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-600">{title}</h2>
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-contain rounded-lg border-2 border-green-200"
        />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-gray-700">
          <strong>Total: </strong>
          {stats.total}
        </p>
        <p className="text-yellow-500">
          <strong>On Progress: </strong>
          {stats.inProgress}
        </p>
        <p className="text-blue-500">
          <strong>Finished: </strong>
          {stats.finished}
        </p>
      </div>
      <a
        href={`/testing/${testId}`}
        className="mt-4 absolute bottom-4 right-4 text-sm text-green-500 hover:text-green-700 transition"
      >
        Lihat Detail →
      </a>
    </Card>
  );
}