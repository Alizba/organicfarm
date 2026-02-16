"use client";

import { useState, useEffect } from "react";
import ProductTabs from "./Producttabs.jsx";
import ProductCard from "./ProductCard";
import { vegetables } from "../../../lib/data/vegetable.js";
import { fruits } from "../../../lib/data/fruits.js";
import { nuts } from "../../../lib/data/nuts.js";
import { leafyGreens } from "@/lib/data/leafyGreen.js";

const productData = {
  vegetables: vegetables,
  fruits: fruits,
  nuts: nuts,
  leafyGreens: leafyGreens
};

export default function Product() {
  const [activeTab, setActiveTab] = useState("vegetables");

  const currentProducts = productData[activeTab] || [];

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
          Farm Fresh Products
        </h1>
        <p className="text-gray-600 text-xs max-w-2xl mx-auto">
          Browse our selection of fresh, organic produce delivered straight from local farms
        </p>
      </div>

      {/* Product Tabs */}
      <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {currentProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products available in this category</p>
        </div>
      )}
    </section>
  );
}