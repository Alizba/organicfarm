"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
`;

const STATUS_COLORS = {
  pending:  { bg: "#fef9c3", color: "#92400e" },
  approved: { bg: "#ecfdf5", color: "#059669" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
};

export default function AdminShopRequestsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [requests, setRequests]       = useState([]);
  const [fetching, setFetching]       = useState(true);
  const [filter, setFilter]           = useState("pending"); 
  const [actionId, setActionId]       = useState(null);      
  const [rejectModal, setRejectModal] = useState(null);      
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user, filter]);

  const fetchRequests = async () => {
    setFetching(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const { data } = await axios.get(`/api/admin/shop-requests${params}`);
      setRequests(data.requests || []);
    } catch (e) {
      setError("Failed to load requests.");
    } finally {
      setFetching(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Approve this shopkeeper application?")) return;
    setActionId(id);
    try {
      await axios.patch(`/api/admin/shop-requests?id=${id}`, { action: "approve" });
      fetchRequests();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to approve.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionId(rejectModal.id);
    try {
      await axios.patch(`/api/admin/shop-requests?id=${rejectModal.id}`, {
        action: "reject",
        rejectionReason: rejectReason,
      });
      setRejectModal(null);
      setRejectReason("");
      fetchRequests();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to reject.");
    } finally {
      setActionId(null);
    }
  };

  if (loading || !user) return <Loader />;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#fafaf9" }}>

        {/* Nav */}
        <nav style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          padding: "0 40px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>
            Admin Panel
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Shop Applications
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              Review and approve or reject shopkeeper requests.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="fade-in" style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {["pending", "approved", "rejected", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 18px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                  border: "1px solid",
                  borderColor: filter === f ? "#0f172a" : "#e5e7eb",
                  background: filter === f ? "#0f172a" : "#fff",
                  color: filter === f ? "#fff" : "#64748b",
                  cursor: "pointer", fontFamily: "inherit",
                  textTransform: "capitalize",
                }}
              >{f}</button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {fetching && (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div>
          )}

          {/* Empty */}
          {!fetching && requests.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 14 }}>
              No <strong>{filter}</strong> applications found.
            </div>
          )}

          {/* Request Cards */}
          {!fetching && requests.map((req) => {
            const statusStyle = STATUS_COLORS[req.status] || STATUS_COLORS.pending;
            const isProcessing = actionId === req._id;

            return (
              <div
                key={req._id}
                className="card fade-in"
                style={{
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 14, padding: "24px 28px", marginBottom: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>{req.shopName}</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>by {req.fullName}</div>
                  </div>
                  <span style={{
                    background: statusStyle.bg, color: statusStyle.color,
                    fontSize: 11, fontWeight: 700, padding: "4px 10px",
                    borderRadius: 99, textTransform: "capitalize",
                  }}>{req.status}</span>
                </div>

                {/* Details grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 16 }}>
                  {[
                    { label: "Email",    value: req.email },
                    { label: "Username", value: req.userName },
                    { label: "Phone",    value: req.phone || "—" },
                    { label: "Applied",  value: new Date(req.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
                      <div style={{ fontSize: 13, color: "#0f172a", marginTop: 2 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Shop description */}
                {req.shopDescription && (
                  <div style={{
                    background: "#f8fafc", borderRadius: 8, padding: "10px 14px",
                    fontSize: 13, color: "#475569", marginBottom: 16,
                  }}>
                    {req.shopDescription}
                  </div>
                )}

                {/* Rejection reason */}
                {req.status === "rejected" && req.rejectionReason && (
                  <div style={{
                    background: "#fef2f2", borderRadius: 8, padding: "10px 14px",
                    fontSize: 13, color: "#dc2626", marginBottom: 16,
                  }}>
                    <strong>Reason:</strong> {req.rejectionReason}
                  </div>
                )}

                {/* Action buttons — only for pending */}
                {req.status === "pending" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={isProcessing}
                      style={{
                        background: "#059669", color: "#fff", border: "none",
                        borderRadius: 8, padding: "9px 20px", fontSize: 13,
                        fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        opacity: isProcessing ? 0.6 : 1,
                      }}
                    >{isProcessing ? "Processing…" : "✓ Approve"}</button>
                    <button
                      onClick={() => { setRejectModal({ id: req._id, shopName: req.shopName }); setRejectReason(""); }}
                      disabled={isProcessing}
                      style={{
                        background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
                        borderRadius: 8, padding: "9px 20px", fontSize: 13,
                        fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                        opacity: isProcessing ? 0.6 : 1,
                      }}
                    >✕ Reject</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32,
            width: "100%", maxWidth: 440,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", marginBottom: 8 }}>
              Reject Application
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Rejecting <strong>{rejectModal.shopName}</strong>. You can optionally provide a reason.
            </div>
            <textarea
              placeholder="Rejection reason (optional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "10px 12px", fontSize: 13,
                border: "1px solid #e5e7eb", borderRadius: 8,
                fontFamily: "inherit", resize: "vertical", marginBottom: 20,
              }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setRejectModal(null)}
                style={{
                  background: "#f1f5f9", color: "#64748b", border: "none",
                  borderRadius: 8, padding: "9px 20px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >Cancel</button>
              <button
                onClick={handleReject}
                style={{
                  background: "#dc2626", color: "#fff", border: "none",
                  borderRadius: 8, padding: "9px 20px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Loader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf9" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}