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
      <div className="p-5 sm:p-8 md:p-10">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <BlogManager apiBase="/api/shopkeeper/blog" posts={posts} setPosts={setPosts} reload={load} />
        )}
      </div>
    </ShopkeeperSidebar>
  );
}