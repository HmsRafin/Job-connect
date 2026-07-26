import React, { useState } from 'react';
import { 
  Megaphone, Plus, Calendar, DollarSign, Globe, Upload, 
  ExternalLink, ArrowRight, ShieldCheck, CheckCircle 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import PaymentModal from '../../components/common/PaymentModal';

export default function CompanyAdvertisements() {
  const { advertisements, adPricing, createAdvertisement } = usePlatform();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [title, setTitle] = useState('Stripe Global Tech Summit 2026');
  const [description, setDescription] = useState('Join our engineers for a 2-day keynotes on scaling global payment API infrastructure.');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=800&q=80');
  const [websiteUrl, setWebsiteUrl] = useState('https://stripe.com/summit');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-30');
  const [days, setDays] = useState(30);

  const totalCost = days * adPricing.perDay;

  const handleStartCheckout = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    createAdvertisement(
      {
        title,
        description,
        bannerUrl,
        websiteUrl,
        startDate,
        endDate
      },
      days,
      totalCost,
      {
        ...paymentDetails,
        company: 'Stripe Global'
      }
    );
    setShowPayment(false);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            Independent Brand Promotion Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Company Advertisements</h1>
          <p className="text-xs text-slate-300">Promote your company brand, hackathons, and corporate culture directly to candidate visitors.</p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Advertisement</span>
        </button>
      </div>

      {/* Create Ad Form */}
      {showCreateForm && (
        <form onSubmit={handleStartCheckout} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-brand-navy">Create Company Brand Advertisement</h3>
            <span className="text-xs font-semibold text-brand-accent">${adPricing.perDay} USD / display day</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Advertisement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Stripe Hackathon 2026"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Target Website URL</label>
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourcompany.com/landing"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono text-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Poster / Banner Image URL</label>
            <input
              type="text"
              required
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Advertisement Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight company mission, tech stack, or event invitation..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Display Days</label>
              <input
                type="number"
                min={7}
                max={365}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-3 text-xs font-bold rounded-xl border border-slate-200 text-brand-navy"
              />
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Campaign Cost</span>
              <span className="text-2xl font-black text-brand-accent">${totalCost} <span className="text-xs font-semibold text-slate-500">USD ({days} days @ ${adPricing.perDay}/day)</span></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-2"
              >
                <span>Proceed to Payment Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Active Advertisements List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Active Brand Advertisement Campaigns</h3>

        {advertisements.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active advertisement campaigns. Click "Create Advertisement" to reach candidate traffic.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advertisements.map((ad) => (
              <div key={ad.id} className="bg-gradient-to-br from-brand-navy via-brand-navyDark to-indigo-950 text-white rounded-2xl p-6 space-y-4 border border-white/10 shadow-lg relative overflow-hidden">
                <img src={ad.bannerUrl} alt={ad.title} className="w-full h-36 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-brand-navy uppercase">ACTIVE AD CAMPAIGN</span>
                    <span className="text-[11px] text-slate-300 font-semibold">{ad.days} Display Days</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">{ad.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ad.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cost: <strong className="text-brand-teal">${ad.cost} USD</strong></span>
                  <a
                    href={ad.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
                  >
                    <span>Target Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        summary={{
          title: `Company Brand Advertisement (${days} Days) - ${title}`,
          duration: days,
          amount: totalCost
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
