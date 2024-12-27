"use client";
import axios from "axios";
import { CardType } from "./card-type";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface TestingTypeStats {
  typeId: string;
  name: string;
  imageUrl: string;
  stats: {
    total: number;
    inProgress: number;
    finished: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<TestingTypeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/testing-type/stats`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("API belum aktif. Silakan coba lagi nanti.");
      toast.error("API belum aktif. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center max-h-80">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((type: TestingTypeStats) => (
            <CardType
              testId={type.typeId}
              key={type.name}
              title={type.name}
              image={type.imageUrl}
              stats={type.stats}
            />
          ))}
        </div>
      )}
    </div>
  );
}
