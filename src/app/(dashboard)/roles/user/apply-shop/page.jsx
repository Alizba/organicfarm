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
  .fade-in { animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .field:focus { border-color: #0f172a !important; outline: none; box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
  .submit-btn:hover:not(:disabled) { background: #1e293b !important; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .back-link:hover { color: #0f172a !important; }
`;

export default function ApplyShop() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [shopName,        setShopName]        = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [submitting,      setSubmitting]       = useState(false);
  const [submitted,       setSubmitted]        = useState(false);
  const [error,           setError]            = useState(null);
  const [existingRequest, setExistingRequest]  = useState(null);
  const [checking,        setChecking]         = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user && user.role !== "user") router.replace(`/dashboard/${user.role}`);
  }, [user, loading]);

  useEffect(() => {
    if (user) checkExisting();
  }, [user]);

  const checkExisting = async () => {
    try {
      const { data } = await axios.get("/api/shopRequest");
      if (data.shopRequest && data.shopRequest.status === "pending") {
        setExistingRequest(data.shopRequest);
      }
    } catch (e) {
      // none
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await axios.post("/api/shopRequest", { shopName, shopDescription });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || checking) return <Loader />;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#fafaf9", display: "flex", flexDirection: "column" }}>

        {/* Nav */}
        <nav style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          padding: "0 40px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0f172a" }}>
            Dashboard
          </span>
          <Link href="/dashboard/user" className="back-link" style={{
            fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500,
          }}>← Back to Dashboard</Link>
        </nav>

        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          justifyContent: "center", padding: "60px 24px",
        }}>
          <div style={{ width: "100%", maxWidth: 520 }}>

            {/* Already pending */}
            {existingRequest ? (
              <div className="fade-in" style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 16, padding: 40, textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: "#0f172a", fontWeight: 400, marginBottom: 12 }}>
                  Application Pending
                </h2>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  You already have a pending shop application for{" "}
                  <strong style={{ color: "#0f172a" }}>"{existingRequest.shopName}"</strong>.
                  Please wait for admin review.
                </p>
                <div style={{
                  background: "#f8fafc", borderRadius: 10, padding: "12px 20px",
                  display: "inline-block", marginBottom: 28,
                }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: 1 }}>STATUS </span>
                  <span style={{
                    background: "#fff8e1", color: "#d97706",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 99, marginLeft: 8,
                  }}>PENDING</span>
                </div>
                <div>
                  <Link href="/dashboard/user">
                    <button style={{
                      background: "#0f172a", color: "#fff", border: "none",
                      borderRadius: 8, padding: "10px 24px",
                      fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}>Return to Dashboard</button>
                  </Link>
                </div>
              </div>
            ) : submitted ? (
              /* Success state */
              <div className="fade-in" style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 16, padding: 48, textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <div style={{
                  width: 64, height: 64, background: "#f0fdf4", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, margin: "0 auto 20px",
                }}>✓</div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#0f172a", fontWeight: 400, marginBottom: 12 }}>
                  Application Submitted!
                </h2>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
                  Your shop application for <strong style={{ color: "#0f172a" }}>"{shopName}"</strong> has been submitted.
                  An admin will review it shortly. You'll be notified on your dashboard.
                </p>
                <Link href="/dashboard/user">
                  <button style={{
                    background: "#0f172a", color: "#fff", border: "none",
                    borderRadius: 8, padding: "12px 28px",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}>Back to Dashboard →</button>
                </Link>
              </div>
            ) : (
              /* Form */
              <div className="fade-in">
                <div style={{ marginBottom: 36 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>
                    Shop Application
                  </p>
                  <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 34, color: "#0f172a", fontWeight: 400 }}>
                    Apply to become a<br />
                    <em>Shopkeeper</em>
                  </h1>
                  <p style={{ color: "#64748b", marginTop: 10, fontSize: 14, lineHeight: 1.7 }}>
                    Fill out the form below. Once approved by an admin, your account will be upgraded and you'll gain access to the shopkeeper portal.
                  </p>
                </div>

                <div style={{
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 16, padding: 36,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}>
                  <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, letterSpacing: 0.3 }}>
                        SHOP NAME *
                      </label>
                      <input
                        className="field"
                        type="text"
                        placeholder="e.g. Fresh Fruits Corner"
                        value={shopName}
                        onChange={e => setShopName(e.target.value)}
                        required
                        style={{
                          width: "100%", padding: "12px 16px",
                          border: "1px solid #e2e8f0", borderRadius: 10,
                          fontSize: 14, fontFamily: "inherit",
                          background: "#fafaf9", transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, letterSpacing: 0.3 }}>
                        DESCRIPTION <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <textarea
                        className="field"
                        placeholder="Tell us about your shop — what you sell, your vision, etc."
                        value={shopDescription}
                        onChange={e => setShopDescription(e.target.value)}
                        rows={4}
                        style={{
                          width: "100%", padding: "12px 16px",
                          border: "1px solid #e2e8f0", borderRadius: 10,
                          fontSize: 14, fontFamily: "inherit", resize: "vertical",
                          background: "#fafaf9", transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                      />
                    </div>

                    {error && (
                      <div style={{
                        background: "#fef2f2", border: "1px solid #fecaca",
                        borderRadius: 8, padding: "10px 16px",
                        fontSize: 13, color: "#dc2626", marginBottom: 20,
                      }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={submitting || !shopName.trim()}
                      style={{
                        width: "100%", background: "#0f172a", color: "#fff",
                        border: "none", borderRadius: 10, padding: "14px",
                        fontSize: 14, fontWeight: 700, cursor: "pointer",
                        fontFamily: "inherit", transition: "background 0.15s",
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Application →"}
                    </button>
                  </form>
                </div>

                {/* Note */}
                <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
                  By applying you agree that an admin will review your request. You can only have one pending application at a time.
                </p>
              </div>
            )}
          </div>
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