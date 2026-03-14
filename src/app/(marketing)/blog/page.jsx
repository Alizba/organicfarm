"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, User, Tag } from "lucide-react";

export default function BlogPage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/public/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(posts.map((p) => p.category).filter(Boolean))];
  const filtered   = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9f4", fontFamily: "sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a3820 0%,#2d5a1e 60%,#3a7a28 100%)", padding: "60px 24px 52px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ width: 32, height: 1, background: "#86efac" }} />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.4em", color: "#86efac", fontWeight: 600 }}>Stories & Tips</span>
          <span style={{ width: 32, height: 1, background: "#86efac" }} />
        </div>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>
          Our <em style={{ color: "#86efac" }}>Blog</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
          Farming insights, seasonal guides, and stories from our growers.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "14px 18px", fontSize: 13, fontWeight: 600, border: "none",
              borderBottom: filter === c ? "2px solid #16a34a" : "2px solid transparent",
              color: filter === c ? "#16a34a" : "#6b7280", background: "none",
              cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap", transition: "all 0.15s",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: 16, background: "#fff", border: "1px solid #e5e7eb", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                <div style={{ height: 180, background: "#e5e7eb" }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 16, background: "#e5e7eb", borderRadius: 8, marginBottom: 10, width: "70%" }} />
                  <div style={{ height: 12, background: "#e5e7eb", borderRadius: 8, width: "90%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <BookOpen size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {filtered.map((post) => (
              <article key={post._id} onClick={() => router.push(`/blog/${post.slug}`)}
                style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
              >
                {/* Cover */}
                <div style={{ height: 180, background: "#f0fdf4", overflow: "hidden", position: "relative" }}>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={40} color="#86efac" />
                    </div>
                  )}
                  {post.category && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#16a34a", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" }}>
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "18px 20px" }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2e1a", margin: "0 0 8px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}…
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af" }}>
                      <User size={11} /> {post.authorName}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af" }}>
                      <Calendar size={11} /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {post.tags?.length > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af" }}>
                        <Tag size={11} /> {post.tags.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}