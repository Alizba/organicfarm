"use client";
import React, { useEffect, useState } from "react"; 
import axios from "axios";
import Link from "next/link"; 
import { useRouter } from "next/navigation";

const VerifyEmailPage = () => {
  const router = useRouter(); 
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false); 

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/auth/verifyemail", { token });
      setVerified(true);
      setError(false);
    } catch (err) {
      setError(true);
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    setError(false);
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    setError(false);
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>

      <h2 className="mb-6 text-stone-600 text-sm break-all">
        {token ? `Token: ${token}` : "No token found"}
      </h2>

      {verified && (
        <div className="text-center">
          <h2 className="text-xl text-green-700 font-semibold mb-3">✅ Email Verified!</h2>
          <Link href="/login" className="text-green-800 underline font-medium">
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <div className="text-center">
          <h2 className="text-xl text-red-600 font-semibold mb-3">❌ Verification Failed</h2>
          <p className="text-stone-500 text-sm mb-3">The link may be expired or invalid.</p>
          <Link href="/login" className="text-red-700 underline font-medium">
            Back to Login
          </Link>
        </div>
      )}

      {!verified && !error && token && (
        <p className="text-stone-500 text-sm animate-pulse">Verifying your email…</p>
      )}
    </div>
  );
};

export default VerifyEmailPage;