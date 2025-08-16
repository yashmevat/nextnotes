"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Loader from "../Loader";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in first!");
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      fetchUser(decoded.email);
    } catch (error) {
      toast.error("Invalid session. Please log in again.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  const fetchUser = async (email) => {
    try {
      const res = await fetch("/api/auth/getuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data);
      } else {
        toast.error("Failed to load user details.");
      }
    } catch (error) {
      toast.error("Error fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader/>
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        No user data found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-black">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        {/* Profile Image */}
        <img
          src={user.imageUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-500"
        />

        {/* Name & Email */}
        <h1 className="text-2xl font-bold mt-4">{user.name || "User"}</h1>
        <p className="text-gray-600">{user.email}</p>

        {/* Edit Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
