"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter(); 
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/auth/me");
      console.log(res.data.data._id);
      setData(res.data.data._id);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logout success");
      router.push("/login"); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <h2 className="mb-4">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`} className="text-blue-600 underline">
            {data}
          </Link>
        )}
      </h2>
      <div className="flex gap-3">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
        <button
          onClick={getUserDetails}
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          Get User Details
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;