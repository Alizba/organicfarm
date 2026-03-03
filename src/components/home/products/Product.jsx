"use client";

import { useState, useEffect, useCallback } from "react";
import ProductTabs from "./Producttabs.jsx";
import ProductCard from "./ProductCard";

const TAB_TO_CATEGORY = {
  vegetables: "vegetables",
  fruits:     "fruits",
  nuts:       "nuts",
  leafyGreens: "greenyLeave",
  roots:      "roots",
};

export default function Product() {
  const [activeTab, setActiveTab]     = useState("vegetables");
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const fetchProducts = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    try {
      const category = TAB_TO_CATEGORY[tab] || tab;
      const res = await fetch(`/api/customer/shop?category=${category}`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab, fetchProducts]);

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
          Farm Fresh Products
        </h1>
        <p className="text-gray-600 text-xs max-w-2xl mx-auto">
          Browse our selection of fresh, organic produce delivered straight from
          local farms
        </p>
      </div>

      {/* Product Tabs */}
      <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse"
              style={{ height: 320 }}
            >
              <div className="bg-gray-200 rounded-xl h-48 mb-4" />
              <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
              <div className="bg-gray-200 rounded h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(activeTab)}
            className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No products available in this category
          </p>
        </div>
      )}
    </section>
  );
}