"use client";

import Image from "next/image";
import Link from "next/link";

// Maps category title → DB slug. Only titles with real DB data get a link.
const SLUG_MAP = {
  "Fruits":     "fruits",
  "Vegetables": "vegetables",
  "Nuts":       "nuts",
};

export default function CategoryCard({ title, image }) {
  const slug    = SLUG_MAP[title];
  const hasData = !!slug;

  const card = (
    <div className={`relative bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl p-6 text-center transition-all duration-300 h-full flex flex-col group
      ${hasData
        ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:from-green-50 hover:to-emerald-100 border-2 border-transparent hover:border-green-300"
        : "cursor-default opacity-70"
      }`}
    >
      {/* Badge */}
      {hasData ? (
        <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Shop →
        </span>
      ) : (
        <span className="absolute top-3 right-3 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Coming Soon
        </span>
      )}

      {/* Image */}
      <div className="relative w-full h-40 mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-contain transition-transform duration-300 ${hasData ? "group-hover:scale-110" : ""}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Title */}
      <h3 className={`mt-auto text-lg font-semibold transition-colors ${
        hasData ? "text-gray-800 group-hover:text-green-700" : "text-gray-500"
      }`}>
        {title}
      </h3>
    </div>
  );

  return hasData ? (
    <Link href={`/shop/${slug}`} className="block h-full">{card}</Link>
  ) : card;
}