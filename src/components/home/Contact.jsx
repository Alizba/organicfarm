'use client'
import React from 'react'
import Link from 'next/link'

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Visit Our Farm",
    value: "Green Valley Road, Organic District, CA 94102",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email Us",
    value: "hello@organicfarm.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Call Us",
    value: "+1 (555) 234-5678",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Farm Hours",
    value: "Mon – Sat: 7am – 6pm  |  Sun: 9am – 3pm",
  },
]

const Contact = () => {
  return (
    <section className="relative bg-[#f6f6f5] py-24 px-6 overflow-hidden" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-100 to-transparent" />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-green-500" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-green-600 font-semibold" style={{ fontFamily: 'sans-serif' }}>Get in Touch</span>
            <span className="w-8 h-px bg-green-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e2d1e] leading-tight">
            We'd love to{' '}
            <span className="text-green-700 italic">hear from you</span>
          </h2>
          <p className="mt-5 text-[#5a6e5a] text-base max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
            Whether you're curious about our produce, want to visit the farm, or just want to say hello — our door is always open.
          </p>
        </div>

        {/* Info cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {contactInfo.map((item, i) => (
            <div key={i} className="flex flex-col items-start gap-3 bg-white border border-[#e5e0d8] rounded-2xl px-5 py-5 shadow-sm hover:shadow-md hover:border-green-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8a9e8a] mb-1" style={{ fontFamily: 'sans-serif' }}>{item.label}</p>
                <p className="text-sm text-[#2d3d2d] font-medium leading-snug" style={{ fontFamily: 'sans-serif' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social row + CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-[#e5e0d8] rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <p className="text-[11px] uppercase tracking-widest text-[#8a9e8a] shrink-0" style={{ fontFamily: 'sans-serif' }}>Follow Us</p>
            <div className="flex gap-2">
              {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                <button key={social} className="py-1.5 px-4 rounded-xl text-xs font-semibold border border-[#e5e0d8] text-[#5a6e5a] hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 cursor-pointer" style={{ fontFamily: 'sans-serif' }}>
                  {social}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1e2d1e] hover:bg-green-700 text-white text-sm font-semibold px-7 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            style={{ fontFamily: 'sans-serif' }}
          >
            Contact Us
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-100 to-transparent" />
    </section>
  )
}

export default Contact