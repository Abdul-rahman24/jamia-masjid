import { useState } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Box, CheckCircle2, IndianRupee, Info } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import type { RentalRequest, Resource } from '../types';

export default function Resources() {
  const { t } = useLang();
  const resources = api.getResources();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Resource | null>(null);
  
  // form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [done, setDone] = useState(false);

  const openForm = (r?: Resource) => {
    setSelectedRes(r || resources[0] || null);
    setQuantity(1);
    setShowForm(true);
    setDone(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    
    const req: RentalRequest = {
      id: `rent-${Date.now()}`,
      resourceId: selectedRes.id,
      customerName: name,
      phone,
      quantity,
      startDate: date,
      returnDate: date,
      purpose,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    api.addRentalRequest(req);
    setDone(true);
  };

  const close = () => {
    setShowForm(false); setDone(false);
    setName(''); setPhone(''); setDate(''); setPurpose('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t('rentTitle')}</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t('rentSub')}</p>
        <button onClick={() => openForm()}
          className="mt-6 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-700 transition-colors shadow">
          {t('rentAskBtn')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(r => (
          <Card key={r.id} className="hover:shadow-lg transition-all flex flex-col h-full border-2 border-transparent hover:border-emerald-100">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Box size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{r.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">{r.description}</p>
              
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">{t('rentQuantity')}</span>
                  <span className="font-black text-gray-900">{r.totalQuantity}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase">{t('rentPrice')}</span>
                  <span className="font-black text-[var(--color-primary)] flex items-center">
                    <IndianRupee size={14} className="mr-0.5" />
                    {r.price > 0 ? `${r.price} / day` : 'Free'}
                  </span>
                </div>
              </div>

              <button onClick={() => openForm(r)}
                className="w-full py-3 rounded-xl font-bold text-[var(--color-primary)] bg-emerald-50 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                {t('rentReqBtn')}
              </button>
            </CardContent>
          </Card>
        ))}
        {resources.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">{t('noItems')}</div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="font-black text-gray-900 text-xl">{t('rentReqBtn')}</h3>
            </div>
            <CardContent className="p-6">
              {done ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">{t('rentSuccess')}</h4>
                  <p className="text-gray-600 mb-6">{t('rentSuccessMsg')}</p>
                  <button onClick={close}
                    className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600">
                    {t('done')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Item *</label>
                    <select required value={selectedRes?.id} onChange={e => setSelectedRes(resources.find(r => r.id === e.target.value) || null)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white">
                      {resources.map(r => <option key={r.id} value={r.id}>{r.name} - ₹{r.price}/day</option>)}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('rentReqQty')} *</label>
                      <input required type="number" min="1" max={selectedRes?.totalQuantity || 1} 
                        value={quantity} onChange={e => setQuantity(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('date')} *</label>
                      <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('name')} *</label>
                    <input required value={name} onChange={e => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('phone')} *</label>
                    <input required value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Purpose *</label>
                    <input required value={purpose} onChange={e => setPurpose(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white"
                      placeholder="E.g., Wedding, Community Event" />
                  </div>
                  
                  {selectedRes && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3 mt-2">
                      <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-800 font-semibold mb-0.5">Estimated Cost</p>
                        <p className="text-sm font-black text-blue-900 flex items-center">
                          <IndianRupee size={14} className="mr-0.5" />
                          {selectedRes.price > 0 ? selectedRes.price * quantity : 'Free'} <span className="font-normal text-xs ml-1">(per day)</span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <button type="button" onClick={close}
                      className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-emerald-600 transition-colors">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
