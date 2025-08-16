"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserLoggedIn(false);
    toast.success("Logged Out Success")
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link href="/">NotesApp</Link>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-4 items-center">
        {userLoggedIn ? (
          <>
            <Link href="/notes/add" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">
              Add Note
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
              Login
            </Link>
            <Link href="/register" className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
              Signup
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 text-white flex flex-col gap-2 p-4 rounded shadow md:hidden">
          {userLoggedIn ? (
            <>
              <Link
                href="/notes/add"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                Add Note
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
