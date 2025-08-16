"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import Loader from "@/app/Loader";

export default function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const [loading,setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const token = localStorage.getItem("token");
  setLoading(true)
   const res =  await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });

    const data =  await res.json()
    setLoading(false)
    if(data.success){
      toast.success(data.message||"Note Added Success")
      router.push("/dashboard");
    }
    else{
      toast.error(data.message||"unable to add note at this moment")
    }

    } catch (error) {
      setLoading(false)
      toast.error(error.message||"internal server error")
    }
   
  };


  if(loading){
    return <Loader/>
  }
  return (
    
            <div>
                <Navbar/>
    <div className="flex items-center justify-center h-screen bg-gray-100 text-black">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96 text-black">
        <h1 className="text-2xl font-bold mb-6">Add Note</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          rows={6}
          required
        ></textarea>
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Note
        </button>
      </form>
    </div>
    </div>
  );
}
