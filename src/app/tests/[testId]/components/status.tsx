"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Status({
  initialStatus,
  testId,
}: {
  initialStatus: string;
  testId: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/tests/status/`, {
        status: newStatus,
        id: testId,
      });
      if (res.status === 200) {
        setStatus(newStatus);
        toast.success("Status berhasil diperbarui.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Status</p>
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${
          status === "completed"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {status === "completed" ? "Selesai" : "Dalam Proses"}
      </span>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubah Status
        </label>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className="border rounded-md p-2"
          disabled={loading}
        >
          <option value="inProgress">Dalam Proses</option>
          <option value="completed">Selesai</option>
        </select>
        {loading && <p className="text-sm text-gray-500">Memperbarui...</p>}
      </div>
    </div>
  );
}
