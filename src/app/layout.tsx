import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Sistem Dashboard",
  description: "Dashboard Surveillance untuk B-LAB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        <main className="mt-[150px] flex-1 p-2">{children}</main>{" "}
        {/* Tambahkan margin-top untuk menghindari overlap */}
      </body>
    </html>
  );
}
