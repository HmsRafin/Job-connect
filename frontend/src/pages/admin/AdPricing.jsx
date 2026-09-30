import React, { useEffect, useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';

export default function AdPricing() {
  const { adPricing, setAdPricing } = usePlatform();
  const [pricing, setPricing] = useState(adPricing);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { setPricing(adPricing); }, [adPricing]);
  const submit = async event => {
    event.preventDefault(); setSaving(true); setMessage('');
    try { await setAdPricing(pricing); setMessage('Advertisement demo prices saved.'); }
    catch { setMessage('Prices could not be saved. Please try again.'); }
    finally { setSaving(false); }
  };
  return <div className="space-y-6">
    <h1 className="text-2xl font-bold">Advertisement Demo Pricing</h1>
    <p>Daily simulated USD rates. No real money is collected.</p>
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 border space-y-4">
      {['Sidebar', 'Banner', 'Premium'].map(placement => <label key={placement} className="block">
        <span className="block font-semibold">{placement} daily rate</span>
        <input className="border rounded-lg p-2" type="number" min="1" step="0.01" required value={pricing?.[placement] ?? ''} onChange={event => setPricing(previous => ({ ...previous, [placement]: Number(event.target.value) }))} />
      </label>)}
      <button disabled={saving} className="rounded-lg bg-brand-navy text-white p-3">{saving ? 'Saving...' : 'Save Ad Rates'}</button>
      {message && <p role="status">{message}</p>}
    </form>
  </div>;
}
