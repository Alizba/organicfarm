import React from 'react'
import Image from 'next/image'

const partners = [
  { id: 1, image: "/images/companies/logo1.png", name: "FarmFresh Co." },
  { id: 2, image: "/images/companies/logo2.png", name: "GreenRoot" },
  { id: 3, image: "/images/companies/logo3.png", name: "OrganicLife" },
  { id: 4, image: "/images/companies/logo4.png", name: "HarvestGood" },
  { id: 5, image: "/images/companies/logo5.png", name: "EarthPure" },
]

// Duplicate for seamless infinite loop
const allPartners = [...partners, ...partners]

const Partners = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#f7f4ef]">

      {/* Subtle grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-50 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center mb-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="w-8 h-px bg-green-500" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-green-600 font-semibold">
            Trusted by nature's best
          </span>
          <span className="w-8 h-px bg-green-500" />
        </div>

        <h2
          className="text-4xl md:text-5xl font-bold text-[#1e2d1e] leading-tight"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Our Organic Farm{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-green-700 italic">Partners</span>
            {/* Underline squiggle accent */}
            
          </span>
        </h2>

        <p className="mt-6 text-[#5a6e5a] text-base max-w-md mx-auto leading-relaxed">
          We collaborate with certified organic farms committed to sustainable, chemical-free agriculture.
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-linear-to-r from-[#f7f4ef] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-linear-to-l from-[#f7f4ef] to-transparent" />

        <div className="flex overflow-hidden">
          <div
            className="flex gap-8 items-center"
            style={{
              animation: 'marquee 22s linear infinite',
              width: 'max-content',
            }}
          >
            {allPartners.map((partner, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center gap-3 bg-white border border-[#e5e0d8] rounded-2xl px-8 py-6 shadow-sm hover:shadow-md hover:border-green-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer shrink-0"
                style={{ minWidth: '180px' }}
              >
                <div className="relative w-24 h-14 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] uppercase tracking-widest text-[#8a9e8a] group-hover:text-green-600 font-semibold transition-colors duration-300">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-2xl mx-auto mt-16 px-6 grid grid-cols-3 gap-6 text-center">
        {[
          { value: "50+", label: "Farm Partners" },
          { value: "100%", label: "Certified Organic" },
          { value: "12+", label: "Years Together" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="text-3xl font-bold text-[#1e2d1e]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {stat.value}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#8a9e8a]">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-50 to-transparent" />

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default Partners