"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowLeft, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/home/products/ProductCard";
import Link from "next/link";

const CATEGORIES = {
  fruits: {
    label:    "Fresh Fruits",
    dbValue:  "fruits",
    desc:     "Sun-ripened, farm-fresh fruits picked at peak sweetness.",
    gradient: "from-orange-400 to-rose-500",
  },
  vegetables: {
    label:    "Fresh Vegetables",
    dbValue:  "vegetables",
    desc:     "Crisp, organic vegetables grown without harmful pesticides.",
    gradient: "from-green-500 to-emerald-700",
  },
  nuts: {
    label:    "Premium Nuts",
    dbValue:  "nuts",
    desc:     "Protein-rich, export-quality nuts sourced from the finest farms.",
    gradient: "from-amber-600 to-yellow-700",
  },
  greenyLeave: {
    label:    "Leafy Greens",
    dbValue:  "greenyLeave",
    desc:     "Tender, nutrient-dense leafy greens from local organic farms.",
    gradient: "from-lime-500 to-green-600",
  },
};

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc",   label: "Name: A → Z" },
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params?.category || "";
  const cat  = CATEGORIES[slug];

  const [products, setProducts]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("default");
  const [priceLimit, setPriceLimit] = useState(10000);
  const [maxPrice, setMaxPrice]     = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [vegOnly, setVegOnly]       = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (slug && !cat) router.replace("/");
  }, [slug, cat]);

  const fetchProducts = async (dbValue) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/customer/shop?category=${dbValue}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      const list = data.products || [];
      setProducts(list);
      if (list.length > 0) {
        const max = Math.ceil(Math.max(...list.map((p) => p.price)) / 100) * 100;
        setMaxPrice(max);
        setPriceLimit(max);
      }
    } catch (e) {
      console.error("fetch error", e);
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && cat) fetchProducts(cat.dbValue);
  }, [slug]);

  useEffect(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }
    result = result.filter((p) => p.price <= priceLimit);
    if (vegOnly)     result = result.filter((p) => p.isVegetarian);
    if (inStockOnly) result = result.filter((p) => p.instock !== false);
    if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, search, priceLimit, sort, vegOnly, inStockOnly]);

  if (!slug) return null;
  if (!cat) return null;

  const activeFilterCount = [
    search,
    priceLimit < maxPrice ? "price" : "",
    vegOnly     ? "veg"   : "",
    inStockOnly ? "stock" : "",
    sort !== "default" ? "sort" : "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch(""); setPriceLimit(maxPrice);
    setSort("default"); setVegOnly(false); setInStockOnly(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-jost      { font-family: 'Jost', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .anim-up   { animation: fadeUp    0.45s ease both; }
        .anim-down { animation: slideDown 0.3s  ease both; }
        .card-in   { animation: fadeUp    0.35s ease both; }
        input[type=range] { -webkit-appearance:none; width:100%; height:4px; border-radius:99px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#1a3820; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); }
      `}</style>

      <div className="font-jost min-h-screen bg-stone-50">

        {/* Hero */}
        <div className={`relative bg-linear-to-br ${cat.gradient} overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-end pr-16 pointer-events-none select-none">
            <div className="text-[140px] opacity-10 leading-none">{cat.icon}</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-stone-50/20 to-transparent" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="anim-up">
              <h1 className="font-cormorant text-5xl font-semibold text-white leading-tight mb-2">{cat.label}</h1>
              <p className="text-white/70 text-sm max-w-md">{cat.desc}</p>
            </div>

           
          </div>
        </div>

        {/* Sticky toolbar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${cat.label.toLowerCase()}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 bg-stone-50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 bg-stone-50 cursor-pointer text-gray-700"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#1a3820] text-white border-[#1a3820]"
                  : "bg-stone-50 text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#96d44e] text-[#1a3820] text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-xs text-gray-400 ml-auto">
              {loading ? "Loading…" : `${filtered.length} of ${products.length} products`}
            </span>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="anim-down border-t border-gray-100 bg-white">
              <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-6 items-end">
                {/* Price range */}
                <div className="flex-1 min-w-52">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Price</label>
                    <span className="text-sm font-bold text-[#1a3820]">Rs. {priceLimit.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min={0} max={maxPrice} step={50} value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    style={{ background: `linear-gradient(to right, #1a3820 ${(priceLimit/maxPrice)*100}%, #e5e7eb ${(priceLimit/maxPrice)*100}%)` }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Rs. 0</span><span>Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-3">
                  {[
                    { label: "🌿 Vegetarian Only", active: vegOnly,     set: setVegOnly },
                    { label: "✅ In Stock Only",   active: inStockOnly, set: setInStockOnly },
                  ].map((t) => (
                    <button key={t.label} onClick={() => t.set((v) => !v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                        t.active ? "bg-[#1a3820] text-white border-[#1a3820]" : "bg-stone-50 text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >{t.label}</button>
                  ))}
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-700 font-medium underline cursor-pointer">
                    Reset all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-80">
                  <div className="bg-gray-100 rounded-xl h-48 mb-4" />
                  <div className="bg-gray-100 rounded h-4 w-3/4 mb-2" />
                  <div className="bg-gray-100 rounded h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => fetchProducts(cat.dbValue)} className="bg-[#1a3820] text-white px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">Try Again</button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
              <p className="text-gray-400 text-sm mb-6">No {cat.label.toLowerCase()} have been added yet.</p>
              <Link href="/" className="bg-[#1a3820] text-white px-6 py-2.5 rounded-xl text-sm font-medium">Browse Home</Link>
            </div>
          )}

          {!loading && !error && products.length > 0 && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products match your filters</h3>
              <button onClick={resetFilters} className="bg-[#1a3820] text-white px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">Reset Filters</button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <div key={product._id || product.id} className="card-in" style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other categories */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h2 className="font-cormorant text-2xl font-semibold text-[#1a2e1a] mb-5">Other Categories</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(CATEGORIES)
                .filter(([key]) => key !== slug)
                .map(([key, c]) => (
                  <Link key={key} href={`/shop/${key}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-stone-50 hover:bg-white hover:border-gray-300 transition-all text-sm font-medium text-gray-700"
                  >
                    <span>{c.icon}</span>{c.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}