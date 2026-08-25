import { useState } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { formatTime } from '../utils/prayerTimes';
import { format } from 'date-fns';
import { MapPin, Clock, Calendar, Upload, CheckCircle2, X, Phone } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import type { JanaazahSubmission } from '../types';

export default function Janaazah() {
  const { t } = useLang();
  const allJanaazah = api.getJanaazah();
  const activeJanaazah = allJanaazah.filter(j => j.active);
  const pastJanaazah = allJanaazah.filter(j => !j.active)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  const contacts = api.getContacts();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: JanaazahSubmission = {
      id: `jan-${Date.now()}`,
      submitterName: name,
      submitterPhone: phone,
      fileName: file?.name,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
    };
    api.addJanaazahSubmission(submission);
    setDone(true);
  };

  const close = () => { setShowForm(false); setDone(false); setName(''); setPhone(''); setFile(null); };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t('janTitle')}</h1>
        <p className="text-gray-500 font-medium text-lg italic">{t('janVerse')}</p>
        <p className="text-gray-400 text-sm mb-6">{t('janVerseM')}</p>
        <button onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-700 transition-colors shadow">
          {t('janSubmitBtn')}
        </button>
      </div>

      <div className="space-y-10">
        {/* Active */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4 border-b pb-2">{t('janActiveTitle')}</h2>
          {activeJanaazah.length === 0 ? (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="p-8 text-center text-gray-400">{t('janNone')}</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeJanaazah.map(j => (
                <Card key={j.id} className="border-l-4 border-l-gray-900 overflow-hidden">
                  <div className="bg-gray-900 text-white px-6 py-3">
                    <h3 className="text-xl font-bold">{j.name}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">{t('date')}</p>
                          <p className="font-semibold">{format(new Date(j.date), 'EEEE, MMMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">{t('time')}</p>
                          <p className="font-semibold">{formatTime(j.prayerTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">Prayer At</p>
                          <p className="font-semibold">{j.prayerLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">Burial At</p>
                          <p className="font-semibold">{j.burialLocation}</p>
                        </div>
                      </div>
                    </div>
                    {j.additionalInfo && <p className="mt-4 pt-4 border-t text-gray-600 text-sm">{j.additionalInfo}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {pastJanaazah.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-gray-600 mb-4 border-b pb-2">{t('janHistTitle')}</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {pastJanaazah.map(j => (
                  <li key={j.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-gray-50">
                    <p className="font-semibold text-gray-900">{j.name}</p>
                    <p className="text-sm text-gray-500">{format(new Date(j.date), 'MMMM d, yyyy')}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h3 className="font-black text-gray-900 text-lg">{t('janFormTitle')}</h3>
                <p className="text-xs text-gray-500">{t('janFormSub')}</p>
              </div>
              <button onClick={close}><X size={22} className="text-gray-400 hover:text-gray-900" /></button>
            </div>

            <CardContent className="p-6">
              {done ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">{t('successTitle')}</h4>
                  <p className="text-gray-600 text-sm mb-6">{t('successJan')}</p>
                  <button onClick={close}
                    className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700 transition-colors">
                    {t('done')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Your Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('submitterName')} *</label>
                    <input required value={name} onChange={e => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder={t('submitterName')} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('submitterPhone')} *</label>
                    <input required value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="+91 XXXXX XXXXX" />
                  </div>

                  {/* Upload notice */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('uploadNotice')}</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-colors">
                      <Upload size={24} className="text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">{file ? file.name : t('clickUpload')}</span>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>

                  {/* Management contacts */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-[var(--color-primary)] mb-3 uppercase tracking-wide">{t('mgmtContact')}</p>
                    {contacts.slice(0, 2).map(c => (
                      <div key={c.id} className="flex items-center gap-2 mb-2">
                        <Phone size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-700">{c.role}:</span>
                        <a href={`tel:${c.phone}`} className="text-sm text-[var(--color-primary)] hover:underline font-bold">{c.phone}</a>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={close}
                      className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full font-semibold hover:bg-gray-50 text-sm">
                      {t('cancel')}
                    </button>
                    <button type="submit"
                      className="flex-1 bg-gray-900 text-white py-2.5 rounded-full font-bold hover:bg-gray-700 text-sm">
                      {t('submitBtn')}
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
