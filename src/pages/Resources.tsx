import { useState } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Box, IndianRupee, CheckCircle2, Info, Plus, Trash2 } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import type { Resource } from '../types';
import { useData } from '../contexts/DataContext';

export default function Resources() {
  const { resources } = useData();
  const { t } = useLang();
    
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);
  
  const [items, setItems] = useState<{ resourceId: string; quantity: number }[]>([]);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');

  const openForm = (r?: Resource) => {
    setItems([{ resourceId: r?.id || resources[0]?.id || '', quantity: 1 }]);
    setDate('');
    setName('');
    setPhone('');
    setPurpose('');
    setDone(false);
    setShowForm(true);
  };

  const close = () => {
    setShowForm(false);
  };

  const addItem = () => {
    setItems([...items, { resourceId: resources[0]?.id || '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'resourceId' | 'quantity', value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !items[0].resourceId) return;

    api.addRentalRequest({
      id: Date.now().toString(),
      items: items,
      customerName: name,
      phone,
      startDate: date,
      returnDate: date, // Simplified to single date for now
      purpose,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });
    setDone(true);
  };

  const totalCost = items.reduce((sum, item) => {
    const r = resources.find(res => res.id === item.resourceId);
    return sum + (r ? r.price * item.quantity : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">{t('rentOut')}</h1>
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
            <div className="p-6 border-b bg-gray-50 sticky top-0 z-10 flex justify-between items-center">
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
                    className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 w-full">
                    {t('done')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dynamic Items List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-bold text-gray-700">Select Items *</label>
                    </div>
                    {items.map((item, index) => {
                      const maxQty = resources.find(r => r.id === item.resourceId)?.totalQuantity || 1;
                      return (
                        <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100 relative group">
                          <div className="flex-1 space-y-2">
                            <select required value={item.resourceId} onChange={e => updateItem(index, 'resourceId', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white">
                              <option value="" disabled>Select product...</option>
                              {resources.map(r => <option key={r.id} value={r.id}>{r.name} - ₹{r.price}/day</option>)}
                            </select>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-500 uppercase">Qty:</span>
                              <input required type="number" min="1" max={maxQty} 
                                value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))}
                                className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                              <span className="text-xs text-gray-400 ml-2">(Max: {maxQty})</span>
                            </div>
                          </div>
                          {items.length > 1 && (
                            <button type="button" onClick={() => removeItem(index)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    
                    <button type="button" onClick={addItem}
                      className="flex items-center justify-center gap-1 w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-emerald-300 hover:text-emerald-600 transition-colors text-sm font-bold">
                      <Plus size={16} /> Add Another Product
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-2 border-t">
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
                  
                  {items.length > 0 && items[0].resourceId && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3 mt-4">
                      <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-800 font-semibold mb-0.5">Total Estimated Cost</p>
                        <p className="text-lg font-black text-blue-900 flex items-center">
                          <IndianRupee size={16} className="mr-0.5" />
                          {totalCost > 0 ? totalCost : 'Free'} <span className="font-normal text-xs ml-1 text-blue-700">(per day)</span>
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
