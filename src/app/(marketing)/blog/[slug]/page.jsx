"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogPostPage() {
  const { slug }  = useParams();
  const router    = useRouter();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/public/blog?slug=${slug}`)
      .then((r) => { if (!r.ok) throw new Error("Post not found"); return r.json(); })
      .then((d) => setPost(d.post))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f7f9f4" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ height: 320, background: "#e5e7eb", borderRadius: 20, marginBottom: 32, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 32, background: "#e5e7eb", borderRadius: 8, width: "70%", marginBottom: 16, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 16, background: "#e5e7eb", borderRadius: 8, marginBottom: 8, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 16, background: "#e5e7eb", borderRadius: 8, width: "85%", animation: "pulse 1.5s infinite" }} />
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );

  if (error || !post) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "sans-serif", color: "#6b7280" }}>
      <p style={{ fontSize: 18 }}>{error || "Post not found"}</p>
      <button onClick={() => router.push("/blog")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#16a34a", background: "none", border: "none", cursor: "pointer" }}>
        <ArrowLeft size={16} /> Back to Blog
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9f4", fontFamily: "sans-serif" }}>

      {/* Back bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.push("/blog")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#4b5563", background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={15} /> Back to Blog
        </button>
      </div>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Cover */}
        {post.coverImage && (
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 36, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
            <img src={post.coverImage} alt={post.title} style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
          </div>
        )}

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 20 }}>
          {post.category && (
            <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, textTransform: "capitalize" }}>
              {post.category}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <User size={12} /> {post.authorName}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#1a2e1a", lineHeight: 1.2, margin: "0 0 24px", fontFamily: "Georgia, serif" }}>
          {post.title}
        </h1>

        {/* Content */}
        <div style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
          {post.content}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tag size={14} color="#9ca3af" />
            {post.tags.map((tag) => (
              <span key={tag} style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}