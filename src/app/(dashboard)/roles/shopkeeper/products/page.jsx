"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ShopkeeperSidebar from "@/components/shopkeeper/ShopkeeperSidebar";
import axios from "axios";

const EMPTY_FORM = {
  name: "", price: "", originalPrice: "", description: "",
  category: "", weight: "", stock: "", isVegetarian: false,
  deal: { isOnDeal: false, dealLabel: "Deal of the Day", dealEndsAt: "" },
};

const DEAL_LABELS = ["Deal of the Day", "Flash Sale", "Weekly Special", "Clearance", "Limited Time Offer"];

const inpCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-slate-50 font-sans focus:outline-none focus:border-slate-900 transition-colors";
const lblCls = "block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5";

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-block w-11 h-6 cursor-pointer shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? "bg-emerald-500" : "bg-slate-200"}`} />
      <span className={`absolute top-0.75 left-0.75 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </label>
  );
}

export default function ShopkeeperProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileRef     = useRef(null);
  const editFileRef = useRef(null);

  const [products,      setProducts]      = useState([]);
  const [fetching,      setFetching]      = useState(true);
  const [showForm,      setShowForm]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [imageFile,     setImageFile]     = useState(null);
  const [categories,    setCategories]    = useState([]);
  const [catLoading,    setCatLoading]    = useState(false);
  const [showCustom,    setShowCustom]    = useState(false);
  const [customLabel,   setCustomLabel]   = useState("");

  const [editProduct,      setEditProduct]      = useState(null);
  const [editForm,         setEditForm]         = useState(null);
  const [editImageFile,    setEditImageFile]    = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editSaving,       setEditSaving]       = useState(false);
  const [editError,        setEditError]        = useState(null);

  useEffect(() => {
    if (!loading && (!user || !["shopkeeper", "admin"].includes(user.role))) router.replace("/login");
  }, [user, loading]);

  useEffect(() => { if (user) { fetchProducts(); fetchCategories(); } }, [user]);

  const fetchProducts = async () => {
    try { const { data } = await axios.get("/api/shopkeeper/products"); setProducts(data.products || []); }
    catch (e) { console.error(e); } finally { setFetching(false); }
  };

  const fetchCategories = async () => {
    setCatLoading(true);
    try { const { data } = await axios.get("/api/shopkeeper/categories"); setCategories(data.categories || []); }
    catch (e) { console.error(e); } finally { setCatLoading(false); }
  };

  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 600;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const compressed = await compressImage(file);
    setImagePreview(compressed);
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return setError("Name and price are required.");
    setSaving(true); setError(null);
    try {
      let imageBase64 = null;
      if (imageFile) imageBase64 = await compressImage(imageFile);
      let categoryId = form.category;
      if (showCustom && customLabel.trim()) {
        const slug = customLabel.toLowerCase().trim().replace(/\s+/g, "-");
        const catRes = await axios.post("/api/shopkeeper/categories", { name: slug, label: customLabel.trim() });
        categoryId = catRes.data.category._id;
        await fetchCategories();
      }
      await axios.post("/api/shopkeeper/products", {
        ...form, category: categoryId,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock: parseInt(form.stock) || 0,
        image: imageBase64,
        deal: { isOnDeal: form.deal.isOnDeal, dealLabel: form.deal.dealLabel, dealEndsAt: form.deal.dealEndsAt || null },
      });
      setForm(EMPTY_FORM); setCustomLabel(""); setShowCustom(false);
      clearImage(); setShowForm(false); fetchProducts();
    } catch (e) { setError(e?.response?.data?.error || "Failed to save product."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await axios.delete("/api/shopkeeper/products?id=" + id); setProducts((p) => p.filter((x) => x._id !== id)); }
    catch { alert("Failed to delete."); }
  };

  const resetForm = () => { setShowForm(false); setForm(EMPTY_FORM); setCustomLabel(""); setShowCustom(false); clearImage(); setError(null); };

  const openEdit = (p) => {
    setEditProduct(p); setEditError(null); setEditImageFile(null);
    setEditImagePreview(p.image || null);
    setEditForm({
      name: p.name || "", price: p.price ?? "", originalPrice: p.originalPrice ?? "",
      description: p.description || "", category: p.category?._id || p.category || "",
      weight: p.weight || "", stock: p.stock ?? "", isVegetarian: p.isVegetarian || false,
      deal: {
        isOnDeal: p.deal?.isOnDeal || false,
        dealLabel: p.deal?.dealLabel || "Deal of the Day",
        dealEndsAt: p.deal?.dealEndsAt ? new Date(p.deal.dealEndsAt).toISOString().slice(0, 16) : "",
      },
    });
  };

  const closeEdit = () => { setEditProduct(null); setEditForm(null); setEditImageFile(null); setEditImagePreview(null); setEditError(null); if (editFileRef.current) editFileRef.current.value = ""; };

  const handleEditImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    const compressed = await compressImage(file);
    setEditImagePreview(compressed);
  };

  const handleEditSubmit = async () => {
    if (!editForm.name || !editForm.price) return setEditError("Name and price are required.");
    setEditSaving(true); setEditError(null);
    try {
      let imageBase64 = undefined;
      if (editImageFile) imageBase64 = await compressImage(editImageFile);
      await axios.put(`/api/shopkeeper/products?id=${editProduct._id}`, {
        name: editForm.name, price: parseFloat(editForm.price),
        originalPrice: editForm.originalPrice ? parseFloat(editForm.originalPrice) : null,
        description: editForm.description, category: editForm.category,
        weight: editForm.weight, stock: parseInt(editForm.stock) || 0,
        isVegetarian: editForm.isVegetarian,
        ...(imageBase64 !== undefined ? { image: imageBase64 } : {}),
        deal: { isOnDeal: editForm.deal.isOnDeal, dealLabel: editForm.deal.dealLabel, dealEndsAt: editForm.deal.dealEndsAt || null },
      });
      closeEdit(); fetchProducts();
    } catch (e) { setEditError(e?.response?.data?.error || "Failed to update product."); }
    finally { setEditSaving(false); }
  };

  if (loading || !user) return <Loader />;

  const selectedCat = categories.find((c) => c._id === form.category);

  return (
    <ShopkeeperSidebar>
      <div className="p-5 sm:p-8 md:p-10">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-3 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl text-slate-900 font-light" style={{ fontFamily: "Georgia, serif" }}>Products</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Manage your product listings.</p>
          </div>
          <button onClick={() => showForm ? resetForm() : setShowForm(true)}
            className={`border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${showForm ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-700"}`}>
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-7 mb-6 shadow-sm">
            <div className="font-bold text-base text-slate-900 mb-5">New Product</div>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}

            {/* Image upload */}
            <div className="mb-5">
              <label className={lblCls}>Product Image</label>
              {imagePreview ? (
                <div className="flex items-center gap-4">
                  <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                  <div className="flex flex-col gap-2">
                    <button onClick={() => fileRef.current?.click()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">Change</button>
                    <button onClick={clearImage} className="text-red-500 hover:text-red-700 text-xs font-medium bg-none border-none cursor-pointer text-left">Remove</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 hover:border-slate-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-white">
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm font-semibold text-slate-700 mb-1">Click to upload image</div>
                  <div className="text-xs text-slate-400">PNG, JPG, WEBP</div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className={lblCls}>Product Name *</label><input className={inpCls} placeholder="e.g. Hazelnut" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><label className={lblCls}>Price (Rs.) *</label><input className={inpCls} type="number" placeholder="e.g. 300" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} /></div>
              <div><label className={lblCls}>Original Price</label><input className={inpCls} type="number" placeholder="e.g. 450" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: e.target.value }))} /></div>
              <div><label className={lblCls}>Stock Qty</label><input className={inpCls} type="number" placeholder="e.g. 20" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} /></div>
              <div>
                <label className={lblCls}>Category {catLoading && <span className="text-[10px] text-slate-400 font-normal ml-1">loading…</span>}</label>
                {!showCustom ? (
                  <select className={inpCls} value={form.category} onChange={(e) => e.target.value === "__new__" ? (setShowCustom(true), setForm((p) => ({ ...p, category: "" }))) : (setShowCustom(false), setForm((p) => ({ ...p, category: e.target.value })))}>
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.label}</option>)}
                    <option value="__new__">+ Add new category…</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input className={`${inpCls} flex-1`} placeholder="e.g. Spices" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} autoFocus />
                    <button onClick={() => { setShowCustom(false); setCustomLabel(""); setForm((p) => ({ ...p, category: "" })); }} className="px-3 bg-slate-100 border border-gray-200 rounded-lg text-slate-500 cursor-pointer text-sm hover:bg-slate-200 transition-colors">↩</button>
                  </div>
                )}
                {selectedCat && !showCustom && <span className="inline-block mt-1.5 bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">{selectedCat.icon} {selectedCat.label}</span>}
              </div>
              <div><label className={lblCls}>Weight</label><input className={inpCls} placeholder="e.g. 0.5kg" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} /></div>
            </div>

            <div className="mb-4">
              <label className={lblCls}>Description</label>
              <textarea className={`${inpCls} resize-y`} placeholder="Describe your product..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer mb-5">
              <input type="checkbox" checked={form.isVegetarian} onChange={(e) => setForm((p) => ({ ...p, isVegetarian: e.target.checked }))} className="w-4 h-4 cursor-pointer accent-emerald-500" />
              <span className="text-sm text-slate-800 font-medium">Mark as Vegetarian</span>
            </label>

            {/* Deal section */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-sm text-amber-800">🏷 Deal / Offer</div>
                  <div className="text-xs text-amber-600 mt-0.5">Feature this product in the Deal of the Day section</div>
                </div>
                <Toggle checked={form.deal.isOnDeal} onChange={(e) => setForm((p) => ({ ...p, deal: { ...p.deal, isOnDeal: e.target.checked } }))} />
              </div>
              {form.deal.isOnDeal && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`${lblCls} text-amber-700`}>Deal Label</label>
                    <select className={`${inpCls} bg-white`} value={form.deal.dealLabel} onChange={(e) => setForm((p) => ({ ...p, deal: { ...p.deal, dealLabel: e.target.value } }))}>
                      {DEAL_LABELS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`${lblCls} text-amber-700`}>Deal Ends At <span className="normal-case font-normal text-amber-500">(optional)</span></label>
                    <input type="datetime-local" className={`${inpCls} bg-white`} value={form.deal.dealEndsAt} onChange={(e) => setForm((p) => ({ ...p, deal: { ...p.deal, dealEndsAt: e.target.value } }))} />
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={saving}
              className="bg-slate-900 hover:bg-slate-700 text-white border-none rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        )}

        {/* Products table — scrollable on mobile */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {fetching ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm">No products yet. Click <strong>+ Add Product</strong> to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-150">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Image", "Product", "Category", "Price", "Stock", "Deal", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} className={`hover:bg-slate-50 transition-colors ${i < products.length - 1 ? "border-b border-slate-50" : ""}`}>
                      <td className="px-4 py-3">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-11 h-11 object-cover rounded-lg border border-gray-200" />
                          : <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📦</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-sm text-slate-900">{p.name}</div>
                        {p.description && <div className="text-xs text-slate-400 mt-0.5 max-w-45 truncate">{p.description}</div>}
                      </td>
                      <td className="px-4 py-3">
                        {p.category
                          ? <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">{p.category?.icon} {p.category?.label || p.category?.name}</span>
                          : <span className="text-slate-400 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">Rs. {p.price?.toLocaleString()}</div>
                        {p.originalPrice && <div className="text-xs text-slate-400 line-through whitespace-nowrap">Rs. {p.originalPrice?.toLocaleString()}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${p.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.deal?.isOnDeal
                          ? <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">🏷 {p.deal.dealLabel}</span>
                          : <span className="text-slate-400 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors">Edit</button>
                          <button onClick={() => handleDelete(p._id)} className="bg-red-50 hover:bg-red-100 text-red-600 border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editProduct && editForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeEdit}>
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-5 sm:px-6 py-4 border-b border-slate-100">
              <div>
                <div className="font-bold text-base text-slate-900">Edit Product</div>
                <div className="text-xs text-slate-400 mt-0.5">{editProduct.name}</div>
              </div>
              <button onClick={closeEdit} className="bg-slate-100 hover:bg-slate-200 border-none rounded-lg px-3 py-1.5 cursor-pointer text-slate-500 text-sm transition-colors">✕</button>
            </div>

            <div className="p-5 sm:p-6">
              {editError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{editError}</div>}

              {/* Image */}
              <div className="mb-5">
                <label className={lblCls}>Product Image</label>
                {editImagePreview ? (
                  <div className="flex items-center gap-4">
                    <img src={editImagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => editFileRef.current?.click()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">Change Image</button>
                      <button onClick={() => { setEditImageFile(null); setEditImagePreview(null); if (editFileRef.current) editFileRef.current.value = ""; }} className="text-red-500 text-xs font-medium bg-transparent border-none cursor-pointer text-left hover:text-red-700">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => editFileRef.current?.click()} className="border-2 border-dashed border-gray-200 hover:border-slate-900 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50">
                    <div className="text-xl mb-1.5">📷</div>
                    <div className="text-sm font-semibold text-slate-700 mb-0.5">Click to upload</div>
                    <div className="text-xs text-slate-400">PNG, JPG, WEBP</div>
                  </div>
                )}
                <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div><label className={lblCls}>Product Name *</label><input className={inpCls} value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} /></div>
                <div><label className={lblCls}>Price (Rs.) *</label><input className={inpCls} type="number" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} /></div>
                <div><label className={lblCls}>Original Price</label><input className={inpCls} type="number" value={editForm.originalPrice} onChange={(e) => setEditForm((p) => ({ ...p, originalPrice: e.target.value }))} /></div>
                <div><label className={lblCls}>Stock Qty</label><input className={inpCls} type="number" value={editForm.stock} onChange={(e) => setEditForm((p) => ({ ...p, stock: e.target.value }))} /></div>
                <div>
                  <label className={lblCls}>Category</label>
                  <select className={inpCls} value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}>
                    <option value="">No category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
                <div><label className={lblCls}>Weight</label><input className={inpCls} value={editForm.weight} onChange={(e) => setEditForm((p) => ({ ...p, weight: e.target.value }))} /></div>
              </div>

              <div className="mb-4">
                <label className={lblCls}>Description</label>
                <textarea className={`${inpCls} resize-y`} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer mb-5">
                <input type="checkbox" checked={editForm.isVegetarian} onChange={(e) => setEditForm((p) => ({ ...p, isVegetarian: e.target.checked }))} className="w-4 h-4 cursor-pointer accent-emerald-500" />
                <span className="text-sm text-slate-800 font-medium">Mark as Vegetarian</span>
              </label>

              {/* Deal */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-sm text-amber-800">🏷 Deal / Offer</div>
                    <div className="text-xs text-amber-600 mt-0.5">Feature this product in the Deal of the Day section</div>
                  </div>
                  <Toggle checked={editForm.deal.isOnDeal} onChange={(e) => setEditForm((p) => ({ ...p, deal: { ...p.deal, isOnDeal: e.target.checked } }))} />
                </div>
                {editForm.deal.isOnDeal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`${lblCls} text-amber-700`}>Deal Label</label>
                      <select className={`${inpCls} bg-white`} value={editForm.deal.dealLabel} onChange={(e) => setEditForm((p) => ({ ...p, deal: { ...p.deal, dealLabel: e.target.value } }))}>
                        {DEAL_LABELS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`${lblCls} text-amber-700`}>Deal Ends At <span className="normal-case font-normal text-amber-500">(optional)</span></label>
                      <input type="datetime-local" className={`${inpCls} bg-white`} value={editForm.deal.dealEndsAt} onChange={(e) => setEditForm((p) => ({ ...p, deal: { ...p.deal, dealEndsAt: e.target.value } }))} />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-slate-100">
                <button onClick={closeEdit} className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors">Cancel</button>
                <button onClick={handleEditSubmit} disabled={editSaving} className="bg-slate-900 hover:bg-slate-700 text-white border-none rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-colors disabled:opacity-60">
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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