"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ComboBox from "@/components/ui/combo-box";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Produk, TestingType } from "@prisma/client";

const formSchema = z.object({
  produkId: z.string().nonempty("Product is required."),
  testingTypeId: z.string().nonempty("Testing Type is required."),
  startDate: z.date({
    required_error: "Start Date is required.",
    invalid_type_error: "Invalid date format.",
  }),
  endDate: z.date({
    required_error: "End Date is required.",
    invalid_type_error: "Invalid date format.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

interface FormTestProps {
  products: Produk[];
  testingTypes: TestingType[];
  fetchData: () => Promise<void>;
  toggleEditing: () => void;
}

export default function FormTest({
  products,
  testingTypes,
  fetchData,
  toggleEditing,
}: FormTestProps) {
  const router = useRouter();

  const now = new Date();
  const fourDaysLater = new Date();
  fourDaysLater.setDate(now.getDate() + 4);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produkId: "",
      testingTypeId: "",
      startDate: now,
      endDate: fourDaysLater,
    },
  });

  const produkId = watch("produkId");
  const testingTypeId = watch("testingTypeId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post("/api/tests", data);
      toast.success(response.data.message || "Test created successfully!");
      router.refresh();
      fetchData();
      toggleEditing();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error || "Failed to create test. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 p-8 bg-white rounded-md shadow-lg border border-gray-200"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-700 border-b-2 border-gray-300 pb-2">
          Create New Test
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product
          </label>
          <ComboBox
            options={products.map((product) => ({
              label: product.nama,
              value: product.id,
            }))}
            value={produkId}
            onChange={(value) => setValue("produkId", value)}
            heading="Select a Product"
            className="border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {errors.produkId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.produkId.message}
            </p>
          )}
        </div>

        {/* Testing Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Testing Type
          </label>
          <ComboBox
            options={testingTypes.map((type) => ({
              label: type.name,
              value: type.id,
            }))}
            value={testingTypeId}
            onChange={(value) => setValue("testingTypeId", value)}
            heading="Select a Testing Type"
            className="border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {errors.testingTypeId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.testingTypeId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <DatePicker
            selected={startDate ?? new Date()}
            onChange={(date: Date | undefined) => {
              if (date !== undefined) {
                setValue("startDate", date);
              }
            }}
            className="w-full border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <DatePicker
            selected={endDate ?? new Date()}
            onChange={(date: Date | undefined) => {
              if (date !== undefined) {
                setValue("endDate", date);
              }
            }}
            className="w-full border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {errors.endDate && (
            <p className="text-sm text-red-500 mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
          disabled={isSubmitting}
        >
          Create Test
        </Button>
      </div>
    </form>
  );
}
