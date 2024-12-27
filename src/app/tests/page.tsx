"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FormTest from "./_components/form-test";
import TestDataTable, { TestData } from "./_components/test-data-table";
import { Button } from "@/components/ui/button";
import { Produk, TestingType } from "@/types/type";

export default function Page() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [testingTypes, setTestingTypes] = useState<TestingType[]>([]);
  const [testData, setTestData] = useState<TestData[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const [productsRes, testingTypesRes, testDataRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/testing-type"),
        axios.get("/api/tests"),
      ]);

      // Transform testData to include related `produk` and `testingType`
      interface Test {
        id: string;
        produkId: string;
        testingTypeId: string;
        startDate: Date;
        endDate: Date;
        qrCode?: string;
        createdAt: Date;
        updatedAt: Date;
      }

      const transformedTestData = testDataRes.data.map((test: Test) => ({
        ...test,
        produk: productsRes.data.find((p: Produk) => p.id === test.produkId),
        testingType: testingTypesRes.data.find(
          (t: TestingType) => t.id === test.testingTypeId
        ),
      }));

      setProducts(productsRes.data);
      setTestingTypes(testingTypesRes.data);
      setTestData(transformedTestData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete a test record
  const deleteTest = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await axios.delete("/api/tests", {
        data: { id },
      });
      toast.success(res.data.message || "Data berhasil dihapus.");
      fetchData();
    } catch (error) {
      console.error("Error deleting test data:", error);
      toast.error("Gagal menghapus data.");
    }
  };

  return (
    <>
      <div className="p-4 m-4 rounded-md border shadow-md">
        <div className="flex items-center justify-between gap-x-4 ">
          <h1 className="text-2xl font-semibold text-green-600">
            Tambah Test Baru
          </h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="default"
            size="default"
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
        {isEditing && (
          <FormTest
            products={products}
            testingTypes={testingTypes}
            fetchData={fetchData}
            toggleEditing={() => setIsEditing(false)}
          />
        )}
      </div>
      <div className="p-4 m-4 rounded-md border shadow-md">
        <TestDataTable data={testData} deleteTest={deleteTest} />
      </div>
    </>
  );
}
