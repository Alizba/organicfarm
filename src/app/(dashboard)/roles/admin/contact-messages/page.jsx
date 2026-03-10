"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .row-item { transition: background 0.15s; cursor: pointer; }
  .row-item:hover { background: #f8fafc !important; }
`;

const SUBJECT_LABELS = {
  produce: "Produce & Orders", visit: "Farm Visit",
  wholesale: "Wholesale Inquiry", partnership: "Partnership", other: "Other",
};

export default function AdminContactMessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") {
      axios.get("/api/admin/contact-messages")
        .then(({ data }) => setMessages(data.messages || []))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.patch("/api/admin/contact-messages", { id });
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
      if (selected?._id === id) setSelected((prev) => ({ ...prev, isRead: true }));
    } catch (e) { console.error(e); }
  };

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.isRead) markAsRead(msg._id);
  };

  if (loading || !user) return <Loader />;

  const filtered = messages.filter((m) => filter === "unread" ? !m.isRead : filter === "read" ? m.isRead : true);
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <>
      <style>{css}</style>
      <AdminSidebar>
        <div style={{ padding: "48px 40px" }}>
          <div className="fade-in" style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>Contact Messages</h1>
              <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Messages submitted via the contact form.</p>
            </div>
            {unreadCount > 0 && (
              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 99, padding: "6px 16px", fontSize: 13, fontWeight: 700, color: "#d97706" }}>
                {unreadCount} unread
              </div>
            )}
          </div>

          <div className="fade-in" style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[{ value: "all", label: `All (${messages.length})` }, { value: "unread", label: `Unread (${unreadCount})` }, { value: "read", label: `Read (${messages.length - unreadCount})` }].map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{
                padding: "7px 18px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                border: "1px solid", borderColor: filter === f.value ? "#0f172a" : "#e5e7eb",
                background: filter === f.value ? "#0f172a" : "#fff",
                color: filter === f.value ? "#fff" : "#64748b",
                cursor: "pointer", fontFamily: "inherit",
              }}>{f.label}</button>
            ))}
          </div>

          <div className="fade-in" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            {fetching ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 12 }}>📭</div><div style={{ color: "#94a3b8", fontSize: 14 }}>No messages</div></div>
            ) : filtered.map((msg, i) => (
              <div key={msg._id} className="row-item" onClick={() => openMessage(msg)} style={{
                display: "grid", gridTemplateColumns: "auto 1.2fr 1.5fr 1fr auto",
                alignItems: "center", gap: 16, padding: "16px 24px",
                borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                background: msg.isRead ? "#fff" : "#f0fdf4",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: msg.isRead ? "transparent" : "#10b981" }} />
                <div>
                  <div style={{ fontWeight: msg.isRead ? 500 : 700, fontSize: 13, color: "#0f172a" }}>{msg.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{msg.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#0f172a", fontWeight: msg.isRead ? 400 : 600 }}>{SUBJECT_LABELS[msg.subject] || msg.subject}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{msg.message}</div>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(msg.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</div>
                <div>
                  {msg.isRead
                    ? <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: 99 }}>Read</span>
                    : <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "2px 8px", borderRadius: 99 }}>New</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminSidebar>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{SUBJECT_LABELS[selected.subject] || selected.subject}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{new Date(selected.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 24, padding: "14px 16px", background: "#f8fafc", borderRadius: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#64748b", flexShrink: 0 }}>
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{selected.email}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{selected.message}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] || selected.subject}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, background: "#0f172a", color: "#fff", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                ✉ Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Loader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}