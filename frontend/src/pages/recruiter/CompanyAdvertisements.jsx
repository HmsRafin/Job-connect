import React, { useState } from 'react';
import { 
  Megaphone, Plus, Calendar, DollarSign, Globe, Upload, 
  ExternalLink, ArrowRight, ShieldCheck, CheckCircle 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import PaymentModal from '../../components/common/PaymentModal';

export default function CompanyAdvertisements() {
  const { advertisements, adPricing, createAdvertisement, currentUser } = usePlatform();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const currentComp = currentUser?.companyName || currentUser?.name || '';
  const currentDbId = currentUser?.dbId || (currentUser?.id ? Number(String(currentUser.id).replace('usr-', '')) : null);

  const companyAds = advertisements.filter(ad => {
    if (!currentUser) return false;
    if (currentDbId && ad.userId && Number(ad.userId) === Number(currentDbId)) return true;
    if (currentComp && ad.company && ad.company.trim().toLowerCase() === currentComp.trim().toLowerCase()) return true;
    return false;
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(30);

  const totalCost = days * (adPricing?.Sidebar || 9);

  const handleStartCheckout = (e) => {
    e.preventDefault();
    if (!title.trim() || !websiteUrl.trim()) {
      alert('Please provide advertisement title and target website URL.');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    const compName = currentUser?.companyName || currentUser?.name || 'Company';
    
    await createAdvertisement({
      company: compName,
      title: title.trim(),
      description: description.trim(),
      bannerUrl: bannerUrl.trim() || 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=800&q=80',
      websiteUrl: websiteUrl.trim(),
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days,
      placement: 'Sidebar',
      cost: totalCost
    });

    setShowPayment(false);
    setShowCreateForm(false);
    setTitle('');
    setDescription('');
    setBannerUrl('');
    setWebsiteUrl('');
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
          className="px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md shadow-brand-accent/25 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Advertisement</span>
        </button>
      </div>

      {/* Create Ad Form */}
      {showCreateForm && (
        <form onSubmit={handleStartCheckout} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-brand-navy">Create Brand Campaign</h3>
            <span className="text-xs font-bold text-brand-accent">${adPricing?.Sidebar || 9} demo USD / Day</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Campaign Title <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Global Engineering Hackathon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Destination URL <span className="text-rose-500">*</span></label>
              <input
                type="url"
                required
                placeholder="https://company.com/event"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Campaign Description</label>
            <textarea
              rows={3}
              placeholder="Highlight the key message or event details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Banner Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Campaign Duration (Days)</label>
              <input
                type="number"
                min="7"
                max="365"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-bold text-brand-navy"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Total Campaign Budget:</span>
              <span className="text-2xl font-black text-brand-navy">${totalCost} <span className="text-xs font-normal text-slate-400">USD</span></span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Proceed to Secure Checkout</span>
            </button>
          </div>
        </form>
      )}

      {/* Ads List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Active Company Advertisements</h3>

        {companyAds.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <Megaphone className="w-8 h-8 mx-auto text-slate-300" />
            <p>No advertisements active currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyAds.map((ad) => {
              const imageSrc = ad.bannerUrl || ad.imageUrl || 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=800&q=80';
              const targetLink = ad.websiteUrl || ad.targetUrl || '#';
              const adCost = ad.cost || (ad.days ? ad.days * 15 : 450);

              return (
                <div key={ad.id} className="p-6 rounded-2xl border border-slate-200 hover:border-brand-accent/30 shadow-sm space-y-4 bg-white transition-all">
                  {imageSrc && (
                    <img src={imageSrc} alt={ad.title} className="w-full h-40 rounded-xl object-cover border border-slate-100" />
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-navy">{ad.company}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ad.status || 'Active'} ({ad.days || 30} Days)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-brand-navy mt-1">{ad.title}</h4>
                    {ad.description && <p className="text-xs text-slate-600 mt-1">{ad.description}</p>}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Campaign Cost: <strong className="text-brand-accent">${adCost} USD</strong></span>
                    <a href={targetLink} target="_blank" rel="noreferrer" className="text-brand-accent hover:underline flex items-center gap-1 font-bold">
                      <span>Visit Campaign</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
        summary={{ title: title || 'Company Advertisement Campaign', amount: totalCost, duration: days }}
      />
    </div>
  );
}
