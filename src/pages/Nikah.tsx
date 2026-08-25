import { useState } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { CheckCircle2, Upload, CalendarCheck } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import type { NikahSubmission } from '../types';
import { format } from 'date-fns';

export default function Nikah() {
  const { t } = useLang();
  const nikah = api.getNikahInfo();

  // form fields
  const [submitterName, setSubmitterName] = useState('');
  const [submitterPhone, setSubmitterPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [groomName, setGroomName] = useState('');
  const [groomAddress, setGroomAddress] = useState('');
  const [groomProof, setGroomProof] = useState<File | null>(null);
  const [brideName, setBrideName] = useState('');
  const [brideAddress, setBrideAddress] = useState('');
  const [brideProof, setBrideProof] = useState<File | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) return;
    
    // save submission for admin
    const sub: NikahSubmission = {
      id: `nik-${Date.now()}`,
      submitterName, submitterPhone,
      preferredDate,
      groomName, groomAddress, groomProof: groomProof?.name,
      brideName, brideAddress, brideProof: brideProof?.name,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
    };
    api.addNikahSubmission(sub);
    setDone(true);
  };

  const close = () => {
    setDone(false);
    setSubmitterName(''); setSubmitterPhone(''); setPreferredDate('');
    setGroomName(''); setGroomAddress(''); setGroomProof(null);
    setBrideName(''); setBrideAddress(''); setBrideProof(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t('nikTitle')}</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t('nikSub')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Info left */}
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[var(--color-primary)]" /> Requirements
              </h3>
              <ul className="space-y-2">
                {nikah.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[var(--color-primary)] mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Contact</p>
              <p className="font-black text-gray-900">{nikah.contactPerson}</p>
              <p className="text-[var(--color-primary)] font-bold text-sm">{nikah.contactPhone}</p>
            </CardContent>
          </Card>
        </div>

        {/* Form right */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CalendarCheck size={24} className="text-[var(--color-primary)]" />
                <h2 className="font-black text-gray-900 text-xl">{t('nikFormTitle')}</h2>
              </div>
              
              {done ? (
                <div className="text-center py-12 bg-emerald-50 rounded-2xl">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-2">Booking Submitted!</h4>
                  <p className="text-gray-600 mb-4">{t('nikSuccessMsg')}</p>
                  <p className="text-[var(--color-primary)] font-bold text-lg mb-8">{t('nikWeWillCall')}</p>
                  <button onClick={close}
                    className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors">
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date & Submitter Info */}
                  <div className="grid md:grid-cols-2 gap-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikSelectedDate')} *</label>
                      <input required type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                      <p className="text-xs text-gray-500 mt-1">{t('nikCalNote')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('submitterName')} *</label>
                      <input required value={submitterName} onChange={e => setSubmitterName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('submitterPhone')} *</label>
                      <input required value={submitterPhone} onChange={e => setSubmitterPhone(e.target.value)} type="tel"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white"
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>

                  {/* Groom Info */}
                  <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                    <h3 className="font-bold text-blue-900 border-b border-blue-100 pb-2">Groom Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikGroomName')} *</label>
                        <input required value={groomName} onChange={e => setGroomName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikGroomAddress')} *</label>
                        <input required value={groomAddress} onChange={e => setGroomAddress(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikGroomProof')}</label>
                        <label className="flex items-center gap-3 border-2 border-dashed border-blue-200 bg-white rounded-xl p-3 cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                          <Upload size={20} className="text-blue-400" />
                          <span className="text-sm text-gray-500 flex-1 truncate">{groomProof ? groomProof.name : t('clickUpload')}</span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setGroomProof(e.target.files?.[0] ?? null)} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bride Info */}
                  <div className="p-5 bg-pink-50/50 rounded-xl border border-pink-100 space-y-4">
                    <h3 className="font-bold text-pink-900 border-b border-pink-100 pb-2">Bride Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikBrideName')} *</label>
                        <input required value={brideName} onChange={e => setBrideName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikBrideAddress')} *</label>
                        <input required value={brideAddress} onChange={e => setBrideAddress(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t('nikBrideProof')}</label>
                        <label className="flex items-center gap-3 border-2 border-dashed border-pink-200 bg-white rounded-xl p-3 cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                          <Upload size={20} className="text-pink-400" />
                          <span className="text-sm text-gray-500 flex-1 truncate">{brideProof ? brideProof.name : t('clickUpload')}</span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setBrideProof(e.target.files?.[0] ?? null)} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 font-semibold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> {t('nikWeWillCall')}
                  </div>

                  <button type="submit"
                    className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    {t('submitBtn')}
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
