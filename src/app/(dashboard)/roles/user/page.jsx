"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf9; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .apply-btn:hover { background: #1e293b !important; }
  .nav-link:hover { color: #0f172a !important; }
  .btn-logout:hover { background: #1e293b !important; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.10s; }
`;

export default function UserDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [shopRequest, setShopRequest] = useState(null);
  const [fetching, setFetching]       = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchShopRequest();
  }, [user]);

  const fetchShopRequest = async () => {
    try {
      const { data } = await axios.get("/api/shopRequest");
      setShopRequest(data.shopRequest);
    } catch (e) {
      // no request yet
    } finally {
      setFetching(false);
    }
  };

  if (loading || !user) return <Loader />;

  const statusInfo = {
    pending: {
      icon: "⏳",
      title: "Application Under Review",
      desc: "Your shop request has been submitted and is waiting for admin review. We'll update your account once a decision is made.",
      bg: "#fff8e1", border: "#fde68a", color: "#92400e",
    },
    approved: {
      icon: "🎉",
      title: "Application Approved!",
      desc: "Congratulations! Log out and log back in to receive your shopkeeper access token.",
      bg: "#f0fdf4", border: "#bbf7d0", color: "#065f46",
    },
    rejected: {
      icon: "❌",
      title: "Application Rejected",
      desc: "Unfortunately your shop request was not approved. You can submit a new application.",
      bg: "#fef2f2", border: "#fecaca", color: "#991b1b",
    },
  };

  const reqStatus = shopRequest?.status;
  const info = reqStatus ? statusInfo[reqStatus] : null;

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
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>
              Dashboard
            </span>
            <Link href="/dashboard/user" className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none" }}>Home</Link>
            {!shopRequest || shopRequest.status === "rejected" ? (
              <Link href="/dashboard/user/apply-shop" className="nav-link" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>Apply for Shop</Link>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              background: "#eff6ff", color: "#3b82f6",
              fontSize: 11, fontWeight: 700, padding: "4px 10px",
              borderRadius: 99, letterSpacing: 0.5,
            }}>USER</div>
            <span style={{ fontSize: 13, color: "#64748b" }}>{user.userName}</span>
            <button onClick={logout} className="btn-logout" style={{
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 16px", fontSize: 12,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 40px" }}>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>
              User Dashboard
            </p>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#0f172a", fontWeight: 400 }}>
              Hello, {user.userName} 👋
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              Manage your account and track your shop application status.
            </p>
          </div>

          {/* Account Card */}
          <div className="fade-in d1" style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, padding: 24, marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              Account Info
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Username", value: user.userName },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role },
                { label: "Verified", value: user.isVerified ? "Yes" : "No" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", textTransform: "capitalize" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Request Status */}
          {!fetching && (
            <>
              {info && (
                <div className="fade-in d2" style={{
                  background: info.bg, border: `1px solid ${info.border}`,
                  borderRadius: 12, padding: "20px 24px", marginBottom: 16,
                  display: "flex", gap: 16, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 24 }}>{info.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: info.color, fontSize: 14, marginBottom: 4 }}>
                      {info.title}
                    </div>
                    <div style={{ fontSize: 13, color: info.color, opacity: 0.8, lineHeight: 1.6 }}>
                      {info.desc}
                    </div>
                    {reqStatus === "approved" && (
                      <button onClick={logout} style={{
                        marginTop: 12, background: "#065f46", color: "#fff",
                        border: "none", borderRadius: 8, padding: "8px 18px",
                        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      }}>
                        Logout & Re-login to activate →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Apply CTA — only if no request or rejected */}
              {(!shopRequest || shopRequest.status === "rejected") && (
                <div className="fade-in d2" style={{
                  background: "#fff", border: "1px dashed #cbd5e1",
                  borderRadius: 12, padding: 32, textAlign: "center",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>
                    Want to sell on our platform?
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
                    Apply to become a shopkeeper. Once approved, you'll get access to manage your own shop.
                  </div>
                  <Link href="/dashboard/user/apply-shop">
                    <button className="apply-btn" style={{
                      background: "#0f172a", color: "#fff", border: "none",
                      borderRadius: 8, padding: "12px 28px", fontSize: 14,
                      fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      transition: "background 0.15s",
                    }}>
                      Apply for a Shop →
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
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