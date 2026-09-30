import React, { useState } from 'react';
import { X, Sparkles, Zap, Check, ArrowRight } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import PaymentModal from './PaymentModal';

export default function BoostModal({ isOpen, onClose, itemTitle, itemId }) {
  const { boostPricing, boostListing, currentUser } = usePlatform();
  const [selectedDuration, setSelectedDuration] = useState('7'); // '3', '7', '15', '30', 'custom'
  const [customDays, setCustomDays] = useState(10);
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const pDay3 = boostPricing?.day3 ?? 29;
  const pDay7 = boostPricing?.day7 ?? 59;
  const pDay15 = boostPricing?.day15 ?? 99;
  const pDay30 = boostPricing?.day30 ?? 169;
  const pCustom = boostPricing?.customPerDay ?? 6;

  const getCalculatedPrice = () => {
    if (selectedDuration === '3') return pDay3;
    if (selectedDuration === '7') return pDay7;
    if (selectedDuration === '15') return pDay15;
    if (selectedDuration === '30') return pDay30;
    if (selectedDuration === 'custom') return customDays * pCustom;
    return pDay7;
  };

  const getDurationNumber = () => {
    if (selectedDuration === 'custom') return Number(customDays);
    return Number(selectedDuration);
  };

  const currentPrice = getCalculatedPrice();
  const currentDuration = getDurationNumber();

  const handleStartPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    const compName = currentUser?.companyName || currentUser?.name || 'Company';
    await boostListing(itemId, currentDuration, currentPrice, {
      ...paymentDetails,
      title: itemTitle,
      company: compName
    });
    setShowPayment(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-navy via-brand-navyDark to-indigo-900 text-white p-6 relative flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Featured Placement</span>
                <h3 className="text-lg font-bold text-white">Boost Post Exposure</h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 space-y-4">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Boosting Post:</span>
              <span className="font-bold text-brand-navy truncate max-w-[220px]">{itemTitle || 'Senior Position Listing'}</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-navy">Select Boost Duration</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { days: '3', label: '3 Days', price: pDay3 },
                  { days: '7', label: '7 Days (Popular)', price: pDay7, tag: 'Most Value' },
                  { days: '15', label: '15 Days', price: pDay15 },
                  { days: '30', label: '30 Days', price: pDay30 },
                ].map((opt) => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setSelectedDuration(opt.days)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      selectedDuration === opt.days
                        ? 'border-brand-accent bg-blue-50/60 ring-2 ring-brand-accent/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {opt.tag && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-brand-navy">
                        {opt.tag}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy">{opt.label}</span>
                      <span className="text-sm font-black text-brand-accent">${opt.price}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Days Option */}
              <div className={`p-3.5 rounded-2xl border transition-all mt-2 ${
                selectedDuration === 'custom'
                  ? 'border-brand-accent bg-blue-50/60 ring-2 ring-brand-accent/20'
                  : 'border-slate-200 bg-white'
              }`}>
                <label 
                  onClick={() => setSelectedDuration('custom')}
                  className="flex items-center justify-between cursor-pointer text-xs font-bold text-brand-navy mb-2"
                >
                  <span>Custom Duration (${pCustom}/day)</span>
                  <span className="text-brand-accent font-black">${customDays * pCustom} USD</span>
                </label>
                {selectedDuration === 'custom' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={90}
                      value={customDays}
                      onChange={(e) => setCustomDays(Number(e.target.value))}
                      className="flex-1 accent-brand-accent cursor-pointer"
                    />
                    <span className="text-xs font-bold px-3 py-1 bg-white rounded-lg border border-slate-200">
                      {customDays} Days
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Top of search results priority placement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Glowing "Featured" badge & highlighted border</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>3.5x higher applicant click-through rate</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Boost Price</span>
              <span className="text-2xl font-black text-brand-navy">${currentPrice} <span className="text-xs font-normal text-slate-500">USD</span></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartPayment}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-accent to-blue-600 hover:from-brand-accentHover hover:to-blue-700 text-white shadow-md flex items-center gap-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        summary={{
          title: `Job Boost (${currentDuration} Days) - ${itemTitle}`,
          duration: currentDuration,
          amount: currentPrice
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
