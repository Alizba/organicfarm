"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const splitHalf = (arr) => {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-slate-100 animate-pulse">
      <div className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />
      <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1">
        <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
        <div className="h-2 bg-slate-100 rounded w-1/3" />
      </div>
      <div className="w-12 h-3 bg-slate-100 rounded" />
    </div>
  );
}

function ProductRow({ product }) {
  const isTop3 = product.rank <= 3;
  const rankBg = ["bg-amber-400", "bg-slate-400", "bg-amber-700"];

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-slate-100 hover:border-emerald-400 hover:shadow-md hover:translate-x-0.5 transition-all duration-200">
      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${isTop3 ? `${rankBg[product.rank - 1]} text-white` : "bg-slate-50 text-slate-400"}`}>
        #{product.rank}
      </div>
      <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-linear-to-br from-green-50 to-slate-50 border border-gray-100">
        {product.image
          ? <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
          : <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          {product.totalSold} sold
        </p>
      </div>
      <div className="text-right shrink-0">
        {product.originalPrice > product.price && (
          <p className="text-[10px] text-slate-300 line-through">Rs. {product.originalPrice.toLocaleString()}</p>
        )}
        <p className="text-sm font-bold text-emerald-600">Rs. {product.price?.toLocaleString()}</p>
      </div>
    </div>
  );
}

function Panel({ products, bgImage, loading, onShopClick }) {
  return (
    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_200px] lg:grid-cols-[1fr_220px] gap-3 bg-slate-50 p-3 rounded-2xl shadow-sm">
      {/* Product list */}
      <div className="flex flex-col gap-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          : products.length === 0
            ? <p className="text-center text-slate-300 text-sm py-6">No data yet</p>
            : products.map((p) => <ProductRow key={p._id?.toString()} product={p} />)
        }
      </div>

      {/* Promo card */}
      <div className="relative rounded-2xl overflow-hidden min-h-40">
        {bgImage
          ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }} />
          : <div className="absolute inset-0 bg-linear-to-br from-emerald-900 to-slate-900" />
        }
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-4">
          <p className="text-[9px] tracking-widest uppercase text-emerald-400 mb-1">Limited Time</p>
          <h3 className="text-lg font-black text-white leading-tight mb-1">
            Save up to <span className="text-emerald-400 italic">50% Off</span>
          </h3>
          <p className="text-white/50 text-xs mb-3">Exclusive deals on top products.</p>
          <button
            onClick={onShopClick}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] tracking-widest uppercase py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Shop the Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopSelling() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/customer/top-selling")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        else setError("Failed to load.");
      })
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const [left, right] = splitHalf(products);
  const totalSold = products.reduce((s, p) => s + p.totalSold, 0);

  return (
    <section className="py-16 px-4 md:px-6 bg-white">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.45em] uppercase text-orange-500 mb-2">Curated Selection</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
          Top{" "}
          <span className="italic text-emerald-600" style={{ fontFamily: "'Georgia', serif" }}>Selling</span>
        </h2>
        <div className="w-10 h-0.5 bg-emerald-500 mx-auto mt-3" />
        {!loading && totalSold > 0 && (
          <p className="text-xs text-slate-400 mt-3">Based on {totalSold.toLocaleString()} orders</p>
        )}
      </div>

      {error ? (
        <p className="text-center text-slate-400 py-10">{error}</p>
      ) : !loading && products.length === 0 ? (
        <p className="text-center text-slate-400 py-10 text-sm">
          No sales data yet — products will appear here once orders come in.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-3 max-w-6xl mx-auto">
          <Panel products={left}  loading={loading} bgImage="/images/tsBg.jpg"  onShopClick={() => router.push("/shop")} />
          <Panel products={right} loading={loading} bgImage="/images/tsBg1.png" onShopClick={() => router.push("/shop")} />
        </div>
      )}
    </section>
  );
}