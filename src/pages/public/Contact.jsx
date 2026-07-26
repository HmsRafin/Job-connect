import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    { q: 'Is JobConnect free for job seekers?', a: 'Yes! Job seekers can browse, save, and apply to unlimited jobs 100% free forever.' },
    { q: 'How long does job post moderation take?', a: 'All employer job postings are reviewed by our moderation queue within 1-2 business hours.' },
    { q: 'Can I upload multiple resume versions?', a: 'Yes, candidate profiles support uploading and managing multiple tailored PDF resumes.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">We’re Here to Help You Succeed</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have questions regarding enterprise hiring plans or platform account support? Drop us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Panel */}
        <div className="lg:col-span-5 bg-brand-navy text-white rounded-3xl p-8 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-white">Contact Information</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Reach out to our global support team directly via email or visit our head office in San Francisco.
          </p>

          <div className="space-y-4 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-brand-teal">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block">Email Us</span>
                <span className="font-bold text-white">support@jobconnect.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-brand-accent">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block">Call Support</span>
                <span className="font-bold text-white">+1 (800) 555-CONNECT</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-purple-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block">Global HQ</span>
                <span className="font-bold text-white">500 Howard St, San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-card">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy">Message Sent!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for reaching out. A platform representative will respond to your inquiry shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-accent text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Vance"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@devmail.io"
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enterprise hiring inquiry"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message details..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <h3 className="text-xl font-bold text-brand-navy text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-brand-navy flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-accent shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
