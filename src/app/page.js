"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  return (
    <div className="flex flex-col items-center text-black justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to NotesApp</h1>
      <p className="text-lg mb-8 text-gray-700">Keep your notes organized and secure.</p>

      {loggedIn ? (
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-center"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-600 text-center"
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
}
