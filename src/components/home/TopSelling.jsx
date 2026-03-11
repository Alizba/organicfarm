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
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#fff", borderRadius: 14, padding: "12px 16px",
      border: "1px solid #f1f5f9",
    }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f1f5f9", flexShrink: 0 }} />
      <div style={{ width: 52, height: 52, borderRadius: 10, background: "#f1f5f9", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 11, background: "#f1f5f9", borderRadius: 4, width: "55%", marginBottom: 6 }} />
        <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "30%" }} />
      </div>
      <div style={{ width: 52, height: 11, background: "#f1f5f9", borderRadius: 4 }} />
    </div>
  );
}

function ProductRow({ product }) {
  const isTop3 = product.rank <= 3;
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c2f"];
  const rankColor  = isTop3 ? rankColors[product.rank - 1] : "#cbd5e1";

  return (
    <div className="ts-row" style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#fff", borderRadius: 14,
      padding: "11px 16px",
      border: "1px solid #f1f5f9",
      transition: "all 0.2s",
    }}>
      {/* Rank */}
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        background: isTop3 ? rankColor : "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, fontWeight: 800,
        color: isTop3 ? "#fff" : "#94a3b8",
        boxShadow: isTop3 ? `0 2px 6px ${rankColor}55` : "none",
      }}>#{product.rank}</div>

      {/* Image */}
      <div style={{
        position: "relative", width: 50, height: 50, flexShrink: 0,
        borderRadius: 10, overflow: "hidden",
        background: "linear-gradient(135deg, #f0fdf4, #f8fafc)",
        border: "1px solid #e5e7eb",
      }}>
        {product.image ? (
          <Image src={product.image} alt={product.name} fill style={{ objectFit: "contain", padding: 4 }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌿</div>
        )}
      </div>

      {/* Name + sold */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          {product.totalSold} sold
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {product.originalPrice && product.originalPrice > product.price && (
          <div style={{ fontSize: 10, color: "#cbd5e1", textDecoration: "line-through", marginBottom: 1 }}>
            Rs. {product.originalPrice.toLocaleString()}
          </div>
        )}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>
          Rs. {product.price?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function Panel({ products, bgImage, loading, onShopClick }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      display: "grid",
      gridTemplateColumns: "1fr 260px",
      gap: 12,
      background: "#f8fafc",
      padding: 14,
      borderRadius: 20,
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      alignItems: "stretch", 
    }}>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          : products.length === 0
            ? <div style={{ padding: "24px 0", textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>No data yet</div>
            : products.map((p) => <ProductRow key={p._id?.toString()} product={p} />)
        }
      </div>

      <div style={{
        position: "relative", borderRadius: 16, overflow: "hidden",
        minHeight: 180,   
      }}>
        {bgImage
          ? <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${bgImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
          : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #064e3b, #0f172a)" }} />
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)" }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 18px" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "#10b981", marginBottom: 6 }}>Limited Time</p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 6px" }}>
            Save up to{" "}
            <span style={{ color: "#10b981", fontStyle: "italic" }}>50% Off</span>
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 16 }}>Exclusive deals on top-rated products.</p>
          <button
            onClick={onShopClick}
            style={{
              width: "100%", background: "#10b981",
              color: "#fff", fontWeight: 700, fontSize: 10,
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "11px 0", borderRadius: 10,
              border: "none", cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#10b981"}
          >Shop the Sale</button>
        </div>
      </div>
    </div>
  );
}

export default function TopSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .ts-row:hover {
          border-color: #10b981 !important;
          box-shadow: 0 2px 10px rgba(16,185,129,0.08) !important;
          transform: translateX(2px);
        }
      `}</style>

      <section style={{ padding: "72px 24px", background: "#fff" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", color: "#f97316", marginBottom: 10 }}>
            Curated Selection
          </p>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: "#0f172a", lineHeight: 1.1, margin: 0 }}>
            Top{" "}
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#059669" }}>
              Selling
            </span>
          </h2>
          <div style={{ width: 40, height: 2, background: "#10b981", margin: "14px auto 0" }} />
          {!loading && totalSold > 0 && (
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
              Based on {totalSold.toLocaleString()} orders
            </p>
          )}
        </div>

        {error ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>{error}</div>
        ) : !loading && products.length === 0 ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 40, fontSize: 14 }}>
            No sales data yet — products will appear here once orders come in.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 14, maxWidth: 1360, margin: "0 auto", flexWrap: "wrap" }}>
            <Panel products={left}  loading={loading} bgImage="/images/tsBg.jpg"  onShopClick={() => router.push("/shop")} />
            <Panel products={right} loading={loading} bgImage="/images/tsBg1.png" onShopClick={() => router.push("/shop")} />
          </div>
        )}
      </section>
    </>
  );
}