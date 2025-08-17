"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import Loader from "../Loader";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");
      setLoading(true)
      const res = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data.notes || []);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(data.message || "internal error")
    }

  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");
      setLoading(true)
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLoading(false)
      if (data.success) {
        toast.success(data.message || "Deleted Successfully")
        fetchNotes()
      }
      else {
        toast.error(data.message || "unable to delete")
      }
    } catch (error) {
      setLoading(false)
      toast.error("internal error")
    }


  }

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return <Loader />
  }
  return (

    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />
      {loading && <Loader />}
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <button
            onClick={() => router.push("/notes/add")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Note
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notes.length === 0 && !loading && (
            <p className="text-gray-600 col-span-full text-center">
              No notes found. Add your first note!
            </p>
          )}
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="font-bold text-lg mb-2 break-words">{note.title}</h2>
                <p className="text-gray-700 break-words">{note.content}</p>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => router.push(`/notes/${note.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
