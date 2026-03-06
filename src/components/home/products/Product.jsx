"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductTabs from "./Producttabs.jsx";
import ProductCard from "./ProductCard";

const TAB_TO_CATEGORY = {
  vegetables:  "vegetables",
  fruits:      "fruits",
  nuts:        "nuts",
  greenyLeave: "greenyLeave",
};

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc",   label: "Name: A → Z" },
];

export default function Product() {
  const [activeTab, setActiveTab] = useState("vegetables");
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState("default");
  const [priceLimit, setPriceLimit]   = useState(10000);
  const [maxPrice, setMaxPrice]       = useState(10000);
  const [vegOnly, setVegOnly]         = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    setSearch(""); setSort("default"); setVegOnly(false); setInStockOnly(false);
    try {
      const category = TAB_TO_CATEGORY[tab] || tab;
      const res  = await fetch(`/api/customer/shop?category=${category}`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      const list = data.products || [];
      setProducts(list);
      if (list.length > 0) {
        const max = Math.ceil(Math.max(...list.map((p) => p.price)) / 100) * 100;
        setMaxPrice(max); setPriceLimit(max);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(activeTab); }, [activeTab, fetchProducts]);

  const filtered = useMemo(() => {
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
    return result;
  }, [products, search, priceLimit, sort, vegOnly, inStockOnly]);

  const activeFilterCount = [
    search, priceLimit < maxPrice ? "p" : "",
    vegOnly ? "v" : "", inStockOnly ? "s" : "",
    sort !== "default" ? "o" : "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch(""); setPriceLimit(maxPrice);
    setSort("default"); setVegOnly(false); setInStockOnly(false);
  };

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-50">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">Farm Fresh Products</h1>
        <p className="text-gray-600 text-xs max-w-2xl mx-auto">
          Browse our selection of fresh, organic produce delivered straight from local farms
        </p>
      </div>

      {/* Tabs */}
      <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">

          {/* Search */}
          <div className="relative flex-1 min-w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search products…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 bg-gray-50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 bg-gray-50 cursor-pointer text-gray-700"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
              showFilters || activeFilterCount > 0
                ? "bg-green-700 text-white border-green-700"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-green-700 text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
            {loading ? "Loading…" : `${filtered.length} of ${products.length} products`}
          </span>
        </div>

        {showFilters && (
          <div className="border-t border-gray-100 px-4 py-4 flex flex-wrap gap-6 items-end bg-gray-50">

            <div className="flex-1 min-w-52">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Price</label>
                <span className="text-sm font-bold text-green-700">Rs. {priceLimit.toLocaleString()}</span>
              </div>
              <input
                type="range" min={0} max={maxPrice} step={50} value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full h-1 rounded-full outline-none cursor-pointer accent-green-700"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Rs. 0</span><span>Rs. {maxPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {[
                { label: "🌿 Veg Only",      active: vegOnly,     set: setVegOnly },
                { label: "✅ In Stock Only",  active: inStockOnly, set: setInStockOnly },
              ].map((t) => (
                <button key={t.label} onClick={() => t.set((v) => !v)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                    t.active ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
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
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse" style={{ height: 320 }}>
              <div className="bg-gray-200 rounded-xl h-48 mb-4" />
              <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
              <div className="bg-gray-200 rounded h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={() => fetchProducts(activeTab)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && products.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-lg mb-4">No products match your filters</p>
          <button onClick={resetFilters} className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer">
            Reset Filters
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products available in this category</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}