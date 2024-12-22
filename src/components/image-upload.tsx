import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash, Loader } from "lucide-react";

import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  folder: string;
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  folder,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const filePath = `${folder}/${file.name}`;

      const { error } = await supabase.storage
        .from("dashboard")
        .upload(filePath, file, { upsert: true });

      if (error) {
        toast.error("Failed to upload image." + error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("dashboard")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl); // Update form value
        toast.success("Image uploaded successfully.");
      }
    } catch (err) {
      toast.error("Something went wrong during upload." + err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!value) return;

    setIsLoading(true);
    onRemove(value); // Perbarui state di komponen induk

    try {
      // Ambil path relatif file dari URL
      const baseUrl =
        "https://crmsgchfvmltrwgnvszr.supabase.co/storage/v1/object/public/dashboard/";

      // Hapus base URL untuk mendapatkan path relatif dan decode URI
      const filePath = decodeURIComponent(value.replace(baseUrl, ""));

      const { error } = await supabase.storage
        .from("dashboard")
        .remove([filePath]); // Hapus file menggunakan path lengkap

      if (error) {
        toast.error("Failed to delete image: " + error.message);
        return;
      }

      toast.success("Image deleted successfully.");
    } catch (err) {
      toast.error("Something went wrong during deletion." + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {value ? (
        <>
          <div className="w-full h-60 aspect-video flex items-center justify-center relative rounded-md overflow-hidden">
            <Image
              fill
              sizes="100%"
              className="h-full w-full object-contain"
              alt="Image"
              src={value}
            />
            <div
              className="absolute z-10 top-2 right-2 cursor-pointer"
              onClick={onDelete}
            >
              <Button size={"icon"} variant={"destructive"}>
                <Trash className="h-4 w-4 " />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-60 aspect-video flex items-center justify-center relative rounded-md overflow-hidden border-2 border-dashed bg-neutral-50">
          {isLoading ? (
            <div className="flex items-center">
              <Loader className="animate-spin h-5 w-5 mr-2" /> {/* Spinner */}
              <p>Loading...</p>
            </div>
          ) : (
            <label>
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer text-neutral-500">
                <ImagePlus className="h-10 w-10" />
                <p>Upload an Image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                disabled={disabled}
                onChange={handleChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
