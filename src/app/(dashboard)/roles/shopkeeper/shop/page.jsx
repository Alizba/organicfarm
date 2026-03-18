"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import ShopkeeperSidebar from "@/components/shopkeeper/ShopkeeperSidebar";

export default function ShopkeeperShopPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [shop,     setShop]     = useState(null);
  const [fetching, setFetching] = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState(null);
  const [form,     setForm]     = useState({ shopName: "", shopDescription: "", phone: "" });

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) router.replace("/login");
  }, [user, loading]);

  useEffect(() => { if (user) fetchShop(); }, [user]);

  const fetchShop = async () => {
    try {
      const { data } = await axios.get("/api/shopkeeper/shop");
      setShop(data.shop);
      setForm({ shopName: data.shop?.shopName || "", shopDescription: data.shop?.shopDescription || "", phone: data.shop?.phone || "" });
    } catch { setError("Failed to load shop info."); }
    finally { setFetching(false); }
  };

  const handleSave = async () => {
    if (!form.shopName) return setError("Shop name is required.");
    setSaving(true); setError(null);
    try {
      const { data } = await axios.patch("/api/shopkeeper/shop", form);
      setShop(data.shop); setEditing(false); setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) { setError(e?.response?.data?.error || "Failed to save."); }
    finally { setSaving(false); }
  };

  if (loading || !user) return <Loader />;

  const inpCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-slate-50 font-sans focus:outline-none focus:border-slate-900 transition-colors";
  const lblCls = "block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5";

  return (
    <ShopkeeperSidebar>
      <div className="max-w-2xl mx-auto p-5 sm:p-8 md:p-10">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-3 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl text-slate-900 font-light" style={{ fontFamily: "Georgia, serif" }}>My Shop</h1>
            <p className="text-slate-500 mt-1.5 text-sm">View and update your shop profile.</p>
          </div>
          {!editing && !fetching && (
            <button onClick={() => { setEditing(true); setSuccess(false); }}
              className="bg-slate-900 hover:bg-slate-700 text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors">
              Edit Shop
            </button>
          )}
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-800">
            <span>✓</span> Shop updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
        )}

        {fetching ? (
          <div className="text-center text-slate-400 py-16">Loading...</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Banner */}
            <div className="h-24 bg-linear-to-r from-slate-900 to-slate-600 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl border-[3px] border-white/30">🏪</div>
            </div>

            <div className="p-5 sm:p-8">
              {editing ? (
                <div className="flex flex-col gap-4">
                  {[
                    { key: "shopName", label: "Shop Name *", placeholder: "Your shop name", type: "input" },
                    { key: "phone",    label: "Phone",        placeholder: "Contact number",  type: "input" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className={lblCls}>{f.label}</label>
                      <input value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className={inpCls} />
                    </div>
                  ))}
                  <div>
                    <label className={lblCls}>Shop Description</label>
                    <textarea value={form.shopDescription} onChange={(e) => setForm((p) => ({ ...p, shopDescription: e.target.value }))} placeholder="Tell customers about your shop..." rows={4} className={`${inpCls} resize-y`} />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={handleSave} disabled={saving}
                      className="bg-slate-900 hover:bg-slate-700 text-white border-none rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-colors disabled:opacity-60">
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button onClick={() => { setEditing(false); setError(null); }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="text-2xl text-slate-900 font-light" style={{ fontFamily: "Georgia, serif" }}>{shop?.shopName || "—"}</div>
                    <div className="text-sm text-slate-400 mt-1">@{user.userName}</div>
                  </div>
                  {[
                    { label: "Description",  value: shop?.shopDescription || "No description added yet." },
                    { label: "Email",        value: shop?.email || user.email || "—" },
                    { label: "Phone",        value: shop?.phone || "—" },
                    { label: "Status",       value: shop?.status || "approved" },
                    { label: "Member Since", value: shop?.createdAt ? new Date(shop.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3 border-b border-slate-50 last:border-0">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide sm:w-32 shrink-0 pt-0.5">{row.label}</div>
                      <div className="text-sm text-slate-900 leading-relaxed flex-1">
                        {row.label === "Status" ? (
                          <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize">{row.value}</span>
                        ) : row.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ShopkeeperSidebar>
  );
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin" />
    </div>
  );
}