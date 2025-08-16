"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import Loader from "@/app/Loader";

export default function EditNote() {
    const router = useRouter();
    const params = useParams(); // App Router way
    const { id } = params; // extract note id

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false)
    const fetchNote = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            console.log(data)
            setLoading(false)
            if (data.success) {
                setTitle(data.note.title);
                setContent(data.note.content);
            }
        } catch (error) {
            setLoading(false)
        }

    };

    useEffect(() => {
        if (id) fetchNote();
    }, [id]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true)
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title, content }),
            });
            const data = await res.json();
            setLoading(false)
            if(data.success){
                toast.success(data.messsage||"Note edited success")
                router.push("/dashboard");
            }
            else{
                toast.error(data.messsage||"unable to edit")
            }

        } catch (error) {
           setLoading(false)
           toast.error(data.messsage||"internal server error")
        }
    };

    if(loading){
        return <Loader/>
    }

    return (

        <div>
            <Navbar />
            <div className="flex items-center justify-center h-screen bg-gray-100 text-black">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
                    <h1 className="text-2xl font-bold mb-6">Edit Note</h1>
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
                        Update Note
                    </button>
                </form>
            </div>
        </div>
    );
}
