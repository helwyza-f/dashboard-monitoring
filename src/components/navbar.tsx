"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gray-100 text-green-600 fixed top-0 left-0 w-full z-50 shadow">
      <div className="w-full p-4 md:px-10 flex justify-between items-center">
        {/* Bagian Kiri */}
        <div>
          <h1 className="text-4xl font-bold">B - LAB</h1>
          <h3 className="text-lg">Welcome to Surveillance Dashboard</h3>
        </div>

        {/* Bagian Kanan */}
        <div className="relative hidden md:flex">
          <nav className="flex space-x-8">
            <Link href="/" className="hover:text-green-700">
              Dashboard
            </Link>
            <Link href="/testing" className="hover:text-green-700">
              Jenis Test
            </Link>
            <Link href="/product" className="hover:text-green-700">
              Product
            </Link>
            <Link href="/tests" className="hover:text-green-700">
              Data Test
            </Link>
          </nav>
        </div>

        <div className="relative md:hidden">
          <button
            id="hamburger-btn"
            className="p-2 rounded-md hover:bg-green-200 transition duration-200"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Dropdown Navigasi */}
          {isOpen && (
            <div
              id="dropdown-menu"
              className="absolute top-12 right-0 bg-white shadow-md rounded-md w-48 text-gray-800"
            >
              <ul className="py-2">
                <li>
                  <Link
                    href="/"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/testing"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Jenis Test
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tests"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Data Test
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
