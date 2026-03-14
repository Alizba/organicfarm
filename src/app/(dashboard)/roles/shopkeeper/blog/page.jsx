"use client";
import { useEffect, useState } from "react";
import ShopkeeperSidebar from "@/components/shopkeeper/ShopkeeperSidebar";
import BlogManager from "@/components/blog/BlogManager";
import axios from "axios";

export default function ShopkeeperBlogPage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axios.get("/api/shopkeeper/blog")
      .then((r) => setPosts(r.data.posts || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <ShopkeeperSidebar>
      <div style={{ padding: "28px 32px", fontFamily: "sans-serif" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 80, background: "#e5e7eb", borderRadius: 12, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <BlogManager apiBase="/api/shopkeeper/blog" posts={posts} setPosts={setPosts} reload={load} />
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </ShopkeeperSidebar>
  );
}