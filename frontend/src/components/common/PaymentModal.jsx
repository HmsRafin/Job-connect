import React, { useState } from 'react';
import { X } from 'lucide-react';
export default function PaymentModal({ isOpen, onClose, summary, onPaymentSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  if (!isOpen) return null;
  const handleSubmit = async event => {
    event.preventDefault();
    setProcessing(true); setError('');
    try {
      await onPaymentSuccess({ paymentMethod: 'Demo' });
      onClose();
    } catch (failure) {
      setError(failure.response?.data?.message || 'The demo transaction could not be saved. Please try again.');
    } finally { setProcessing(false); }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center">
          <h3 id="checkout-title" className="text-xl font-bold text-brand-navy">Demo checkout</h3>
          <button type="button" aria-label="Close checkout" onClick={onClose} disabled={processing}><X /></button>
        </div>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Course demonstration: no money is charged and no card details are collected. The transaction will be recorded as Demo.</p>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt>Service</dt><dd className="font-bold">{summary?.title}</dd></div>
          {summary?.duration && <div className="flex justify-between"><dt>Duration</dt><dd>{summary.duration} days</dd></div>}
          <div className="flex justify-between"><dt>Simulated amount</dt><dd className="font-bold">{'$' + Number(summary?.amount || 0).toFixed(2)} USD</dd></div>
        </dl>
        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
        <form onSubmit={handleSubmit}>
          <button type="submit" disabled={processing} className="w-full rounded-xl bg-brand-accent p-3 text-white font-bold disabled:opacity-50">{processing ? 'Saving demo transaction...' : 'Confirm demo transaction'}</button>
        </form>
      </section>
    </div>
  );
}
