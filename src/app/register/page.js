'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import Loader from "../Loader";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image first");

    setImgLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImgUrl(data.secure_url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed. Try again.");
    } finally {
      setImgLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imgUrl) {
      toast.error("Please upload a profile picture before registering");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, imageUrl: imgUrl }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "User registered successfully");
        router.push("/login");
      } else {
        toast.error(data.message || "Unable to register user");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          className="bg-white p-8 text-black rounded shadow w-80"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold mb-6">Register</h1>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <div className="flex flex-col justify-center items-center gap-2 p-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 border rounded"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={imgLoading}
            >
              {imgLoading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
