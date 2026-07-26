import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, summary, onPaymentSuccess }) {
  const [cardholder, setCardholder] = useState('Stripe Talent Acquisition');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [billingAddress, setBillingAddress] = useState('500 Howard St, San Francisco, CA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess({
          cardholder,
          cardNumber,
          billingAddress
        });
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-brand-navy text-white p-6 relative flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-teal">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Checkout & Payment</h3>
              <p className="text-[11px] text-slate-300">Secure 256-Bit Encrypted Subscription Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Item Description:</span>
            <span className="text-brand-navy font-bold">{summary?.title || 'Featured Boost Subscription'}</span>
          </div>
          {summary?.duration && (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Display Duration:</span>
              <span className="font-semibold text-slate-700">{summary.duration} Days</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-extrabold text-brand-navy">Total Amount Due:</span>
            <span className="text-xl font-black text-brand-accent">${summary?.amount || 0} USD</span>
          </div>
        </div>

        {/* Security Access Control Badge */}
        <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-amber-800 text-[11px]">
          <Lock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            <strong>Access Control Policy:</strong> Submitted billing & payment details are protected and strictly visible ONLY to <strong>Company HR</strong> and <strong>Platform Management</strong>.
          </span>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-brand-navy">Payment Authorized Successfully!</h4>
            <p className="text-xs text-slate-500">Activating your subscription feature...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                value={cardholder}
                onChange={(e) => setCardholder(e.target.value)}
                placeholder="Full Name as shown on card"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 •••• •••• 8888"
                  className="w-full p-3 pl-10 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono"
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">Expiration Date</label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1">CVV / CVC</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Billing Address (Optional)</label>
              <input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Street Address, City, Zip"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-accent text-slate-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white shadow-md flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay ${summary?.amount || 0}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
