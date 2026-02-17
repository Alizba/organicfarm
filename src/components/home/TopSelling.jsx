import React from 'react'
import { index } from '@/lib/data'
import Image from 'next/image'

const TopSelling = () => {
  const products = index

  return (
    <section className="py-20 px-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-400 mb-3">Curated Selection</p>
        <h2 className="text-5xl font-bold leading-tight">
          Top <span className="italic text-emerald-600">Selling</span>
        </h2>
        <div className="mt-4 mx-auto w-16 h-px bg-emerald-500" />
      </div>

      <div className="flex gap-6 max-w-7xl mx-auto flex-col xl:flex-row justify-center items-center ">

        {/* LEFT PANEL */}
        <div className="w-1/2 grid lg:grid-cols-[1fr_300px] gap-4 bg-gray-50 p-4 rounded-2xl shadow-xl">

          {/* Product Cards */}
          <div className="flex flex-col gap-3">
            {products.map((elem, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-400 hover:shadow-md transition-all duration-300"
              >
                {/* Image Box */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {elem.image ? (
                    <Image
                      src={elem.image}
                      alt={elem.name}
                      fill
                      className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                      <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors duration-300 pr-2">
                    {elem.name || 'Product Name'}
                  </h3>
                  <span className="text-emerald-600 font-bold text-sm whitespace-nowrap">
                    Rs. {elem.originalPrice || '0.00'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Banner */}
          <div className="relative rounded-xl overflow-hidden min-h-65">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/tsBg.jpg')" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-2">Limited Time</p>
              <h3 className="text-3xl font-bold text-white leading-tight mb-3">
                Save up to <br />
                <span className="text-emerald-400 italic text-4xl">50% Off</span>
              </h3>
              <p className="text-white/60 text-xs mb-5">Exclusive deals on top-rated products.</p>
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors duration-300 cursor-pointer">
                Shop the Sale
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL — identical structure */}
        <div className="w-1/2 grid lg:grid-cols-[1fr_300px] gap-4 bg-gray-50 p-4 rounded-2xl shadow-xl ">

          <div className="flex flex-col gap-3">
            {products.map((elem, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-400 hover:shadow-md transition-all duration-300"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {elem.image ? (
                    <Image
                      src={elem.image}
                      alt={elem.name}
                      fill
                      className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                      <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 items-center justify-between min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors duration-300 pr-2">
                    {elem.name || 'Product Name'}
                  </h3>
                  <span className="text-emerald-600 font-bold text-sm whitespace-nowrap">
                    Rs. {elem.originalPrice || '0.00'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-xl overflow-hidden min-h-65">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/tsBg1.png')" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500 mb-2">Limited Time</p>
              <h3 className="text-3xl font-bold text-white leading-tight mb-3">
                Save up to <br />
                <span className="text-emerald-500 italic text-4xl">50% Off</span>
              </h3>
              <p className="text-white/60 text-xs mb-5">Exclusive deals on top-rated products.</p>
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors duration-300 cursor-pointer">
                Shop the Sale
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TopSelling