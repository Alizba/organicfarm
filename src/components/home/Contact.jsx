'use client'
import React, { useState } from 'react'

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
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="relative bg-[#f6f6f5] py-24 px-6 overflow-hidden" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-50 to-transparent" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-green-500" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-green-600 font-semibold">
              Get in Touch
            </span>
            <span className="w-8 h-px bg-green-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e2d1e] leading-tight">
            We'd love to{' '}
            <span className="relative inline-block">
              <span className="text-green-700 italic">hear from you</span>
            </span>
          </h2>
          <p className="mt-6 text-[#5a6e5a] text-base max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
            Whether you're curious about our produce, want to visit the farm, or just want to say hello — our door is always open.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">

          {/* Left — Contact Info */}
          <div className="flex flex-col gap-5">

            {/* Info cards */}
            {contactInfo.map((item, i) => (
              <div key={i}
                className="flex items-start gap-4 bg-white border border-[#e5e0d8] rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:border-green-300 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#8a9e8a] mb-0.5" style={{ fontFamily: 'sans-serif' }}>
                    {item.label}
                  </p>
                  <p className="text-sm text-[#2d3d2d] font-medium leading-snug" style={{ fontFamily: 'sans-serif' }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Social row */}
            <div className="bg-white border border-[#e5e0d8] rounded-2xl px-6 py-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-widest text-[#8a9e8a] mb-4" style={{ fontFamily: 'sans-serif' }}>
                Follow Our Journey
              </p>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <button key={social}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-[#e5e0d8] text-[#5a6e5a] hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white border border-[#e5e0d8] rounded-3xl p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1e2d1e] mb-2">Message Sent!</h3>
                  <p className="text-[#5a6e5a] text-sm" style={{ fontFamily: 'sans-serif' }}>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="text-xs uppercase tracking-widest text-green-600 border border-green-200 px-5 py-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[#1e2d1e] mb-1">Send a Message</h3>
                <p className="text-[#8a9e8a] text-sm mb-8" style={{ fontFamily: 'sans-serif' }}>
                  Fill in the form and we'll respond promptly.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Jane Smith' },
                      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@email.com' },
                    ].map((field) => (
                      <div key={field.name} className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-widest text-[#8a9e8a]" style={{ fontFamily: 'sans-serif' }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          onFocus={() => setFocused(field.name)}
                          onBlur={() => setFocused('')}
                          placeholder={field.placeholder}
                          required
                          className="w-full bg-[#f7f4ef] border rounded-xl px-4 py-3 text-sm text-[#1e2d1e] placeholder-[#b0bdb0] outline-none transition-all duration-300"
                          style={{
                            fontFamily: 'sans-serif',
                            borderColor: focused === field.name ? '#4ade80' : '#e5e0d8',
                            boxShadow: focused === field.name ? '0 0 0 3px rgba(74,222,128,0.12)' : 'none',
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-[#8a9e8a]" style={{ fontFamily: 'sans-serif' }}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused('')}
                      required
                      className="w-full bg-[#f7f4ef] border rounded-xl px-4 py-3 text-sm text-[#1e2d1e] outline-none transition-all duration-300 cursor-pointer"
                      style={{
                        fontFamily: 'sans-serif',
                        borderColor: focused === 'subject' ? '#4ade80' : '#e5e0d8',
                        boxShadow: focused === 'subject' ? '0 0 0 3px rgba(74,222,128,0.12)' : 'none',
                      }}
                    >
                      <option value="" disabled>Select a topic...</option>
                      <option value="produce">Produce & Orders</option>
                      <option value="visit">Farm Visit</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-[#8a9e8a]" style={{ fontFamily: 'sans-serif' }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      required
                      className="w-full bg-[#f7f4ef] border rounded-xl px-4 py-3 text-sm text-[#1e2d1e] placeholder-[#b0bdb0] outline-none resize-none transition-all duration-300"
                      style={{
                        fontFamily: 'sans-serif',
                        borderColor: focused === 'message' ? '#4ade80' : '#e5e0d8',
                        boxShadow: focused === 'message' ? '0 0 0 3px rgba(74,222,128,0.12)' : 'none',
                      }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-widest py-4 rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    <span>Send Message</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-50 to-transparent" />
    </section>
  )
}

export default Contact