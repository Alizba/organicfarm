'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const ContactPage = () => {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused]     = useState('')
  const [sending, setSending]     = useState(false)
  const [error, setError]         = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message.')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: '100vh', background: '#f6f6f5' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e2d1e 0%, #2d4a2d 60%, #3a6e3a 100%)', padding: '64px 24px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 32, height: 1, background: '#4ade80' }} />
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#86efac', fontFamily: 'sans-serif', fontWeight: 600 }}>Send a Message</span>
          <span style={{ width: 32, height: 1, background: '#4ade80' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, margin: '0 0 14px' }}>
          Let's <em style={{ color: '#86efac' }}>Talk</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 420, margin: '0 auto', lineHeight: 1.7, fontFamily: 'sans-serif' }}>
          Fill in the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e0d8', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <div style={{ height: 4, background: 'linear-gradient(to right, #4ade80, #16a34a, #14532d)' }} />

          {submitted ? (
            <div style={{ padding: '60px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 32, height: 32, color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: 28, fontWeight: 700, color: '#1e2d1e', marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: '#5a6e5a', fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#16a34a', border: '1px solid #bbf7d0', padding: '10px 20px', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600 }}
                >Send Another</button>
                <Link href="/" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', background: '#1e2d1e', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontFamily: 'sans-serif', fontWeight: 600 }}>
                  ← Back Home
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px 32px 36px' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1e2d1e', marginBottom: 4 }}>Send a Message</h3>
              <p style={{ color: '#8a9e8a', fontSize: 13, fontFamily: 'sans-serif', marginBottom: 28 }}>Fill in the form and we'll respond promptly.</p>

              {error && (
                <div style={{ marginBottom: 20, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, color: '#dc2626', fontFamily: 'sans-serif' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { name: 'name',  label: 'Your Name',    type: 'text',  placeholder: 'Jane Smith'     },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@email.com' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a9e8a', fontFamily: 'sans-serif', marginBottom: 6 }}>{field.label}</label>
                      <input
                        type={field.type} name={field.name} value={form[field.name]}
                        onChange={handleChange} placeholder={field.placeholder} required
                        onFocus={() => setFocused(field.name)} onBlur={() => setFocused('')}
                        style={{ width: '100%', padding: '11px 14px', background: '#f7f4ef', border: `1.5px solid ${focused === field.name ? '#4ade80' : '#e5e0d8'}`, borderRadius: 10, fontSize: 13, color: '#1e2d1e', outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box', boxShadow: focused === field.name ? '0 0 0 3px rgba(74,222,128,0.12)' : 'none', transition: 'all 0.15s' }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a9e8a', fontFamily: 'sans-serif', marginBottom: 6 }}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required
                    onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                    style={{ width: '100%', padding: '11px 14px', background: '#f7f4ef', border: `1.5px solid ${focused === 'subject' ? '#4ade80' : '#e5e0d8'}`, borderRadius: 10, fontSize: 13, color: '#1e2d1e', outline: 'none', fontFamily: 'sans-serif', cursor: 'pointer', boxShadow: focused === 'subject' ? '0 0 0 3px rgba(74,222,128,0.12)' : 'none', transition: 'all 0.15s' }}>
                    <option value="" disabled>Select a topic...</option>
                    <option value="produce">Produce & Orders</option>
                    <option value="visit">Farm Visit</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a9e8a', fontFamily: 'sans-serif', marginBottom: 6 }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what's on your mind..." rows={5} required
                    onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                    style={{ width: '100%', padding: '11px 14px', background: '#f7f4ef', border: `1.5px solid ${focused === 'message' ? '#4ade80' : '#e5e0d8'}`, borderRadius: 10, fontSize: 13, color: '#1e2d1e', outline: 'none', fontFamily: 'sans-serif', resize: 'none', boxSizing: 'border-box', boxShadow: focused === 'message' ? '0 0 0 3px rgba(74,222,128,0.12)' : 'none', transition: 'all 0.15s' }}
                  />
                </div>

                <button type="submit" disabled={sending}
                  style={{ width: '100%', background: '#1e2d1e', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'sans-serif', opacity: sending ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={(e) => { if (!sending) e.currentTarget.style.background = '#2d5a1e' }}
                  onMouseLeave={(e) => { if (!sending) e.currentTarget.style.background = '#1e2d1e' }}
                >
                  {sending ? (
                    <>
                      <svg style={{ width: 16, height: 16, animation: 'spin 0.7s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default ContactPage