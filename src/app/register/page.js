'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // note: next/navigation in App Router
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import Loader from "../Loader";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true)
           const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false)
    const data = await res.json();
    if (data.success) 
        {
            toast.success(data.message||"user registered success")
            router.push("/login")

        }
    else {
        
        toast.error(data.message || "unable to add user")
    }
    } catch (error) {

        setLoading(false)
        toast.error(data.message||"Unable to register user")
    }
 
  };
  if(loading){
    return <Loader/>
  }

  return (
    <div>
    <Navbar/>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 text-black rounded shadow w-80"
      >
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 mb-4 border rounded" required/>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded" required/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" required/>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
    </div>
  );
}
