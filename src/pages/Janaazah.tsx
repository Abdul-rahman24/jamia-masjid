import { useState } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { formatTime } from '../utils/prayerTimes';
import { format } from 'date-fns';
import { MapPin, Clock, Calendar, Upload, CheckCircle2, X, Phone, Download, Book, Heart } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import type { JanaazahSubmission } from '../types';
import { useData } from '../contexts/DataContext';

export default function Janaazah() {
  const { janaazah, contacts } = useData();
  const { t } = useLang();
  const allJanaazah = janaazah;
  const activeJanaazah = allJanaazah.filter(j => j.active);
  const pastJanaazah = allJanaazah.filter(j => !j.active)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submit = (filePayload?: string) => {
      const submission: JanaazahSubmission = {
        id: `jan-${Date.now()}`,
        submitterName: name,
        submitterPhone: phone,
        fileName: filePayload || undefined,
        submittedAt: new Date().toISOString(),
        status: 'Pending',
      };
      api.addJanaazahSubmission(submission);
      setDone(true);
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        submit(JSON.stringify({ name: file.name, data: base64 }));
      };
      reader.readAsDataURL(file);
    } else {
      submit();
    }
  };

  const close = () => { setShowForm(false); setDone(false); setName(''); setPhone(''); setFile(null); };

  const renderAdditionalInfo = (info: string) => {
    if (!info) return null;
    try {
      const data = JSON.parse(info);
      if (data.attachmentData && data.attachmentName) {
        return (
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-semibold text-gray-800">Attached Document:</span> {data.attachmentName}
            </div>
            <a href={data.attachmentData} download={data.attachmentName} className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg transition text-sm font-bold w-full sm:w-auto justify-center">
              <Download size={16} /> View Document
            </a>
          </div>
        );
      }
    } catch (e) {
      // Not JSON, render as normal text
    }
    return <p className="mt-6 pt-5 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">{info}</p>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cinematic Header */}
      <div className="mb-12 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 text-white shadow-2xl p-8 md:p-14 text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-arabic mb-6 text-emerald-200/90 tracking-wide font-medium">إِنَّا ِلِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</h2>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{t('janTitle')}</h1>
          <p className="text-emerald-50/90 font-medium text-lg md:text-xl italic max-w-2xl mx-auto">{t('janVerse')}</p>
          <p className="text-emerald-200/60 text-sm mt-3 mb-8">{t('janVerseM')}</p>
          <button onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-900/50 hover:-translate-y-0.5">
            {t('janSubmitBtn')}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Active Janaazah */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-200 pb-3">
            {t('janActiveTitle')}
          </h2>
          {activeJanaazah.length === 0 ? (
            <Card className="bg-gray-50 border-dashed border-2 shadow-none rounded-2xl">
              <CardContent className="p-10 text-center text-gray-500 font-medium">{t('janNone')}</CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {activeJanaazah.map(j => (
                <Card key={j.id} className="border-0 shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden rounded-2xl bg-white">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold tracking-tight">{j.name}</h3>
                    <span className="bg-white/10 backdrop-blur text-white/90 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest hidden sm:inline-block">Janazah Notice</span>
                  </div>
                  <CardContent className="p-6 md:p-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('date')}</p>
                          <p className="font-bold text-gray-900">{format(new Date(j.date), 'EEEE, MMMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('time')}</p>
                          <p className="font-bold text-gray-900">{formatTime(j.prayerTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prayer At</p>
                          <p className="font-bold text-gray-900">{j.prayerLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Burial At</p>
                          <p className="font-bold text-gray-900">{j.burialLocation}</p>
                        </div>
                      </div>
                    </div>
                    {j.additionalInfo && renderAdditionalInfo(j.additionalInfo)}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Educational Section */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-200 pb-3">
            <Book className="text-emerald-600" /> How to Pray Janaazah
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              The Janazah prayer is a collective obligation (Fard Kifayah) and is performed standing, without Ruku (bowing) or Sujud (prostration). It consists of 4 Takbeers (saying <em>Allahu Akbar</em>).
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <h4 className="font-bold text-gray-900">First Takbeer</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">Say Allahu Akbar, then recite Surah Al-Fatihah.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <h4 className="font-bold text-gray-900">Second Takbeer</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">Say Allahu Akbar, then send blessings upon Prophet Muhammad ﷺ (Durood Ibrahim).</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <h4 className="font-bold text-gray-900">Third Takbeer</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">Say Allahu Akbar, then sincerely make Dua for the deceased.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                  <h4 className="font-bold text-gray-900">Fourth Takbeer</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">Say Allahu Akbar, pause briefly, then conclude with Tasleem to the right (and optionally left).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Duas & Condolences Section */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-200 pb-3">
            <Heart className="text-emerald-600" /> Duas & Condolences
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Dua for the Deceased</h3>
                <p className="text-2xl md:text-3xl font-arabic text-right mb-6 leading-loose text-gray-800" dir="rtl">
                  اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ
                </p>
                <p className="text-sm text-gray-500 italic mb-3">
                  "Allahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu"
                </p>
              </div>
              <p className="text-sm text-gray-700 font-medium border-l-4 border-emerald-500 pl-4 py-1">
                "O Allah, forgive him and have mercy on him and give him strength and pardon him."
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">When Offering Condolences</h3>
                <p className="text-2xl md:text-3xl font-arabic text-right mb-6 leading-loose text-gray-800" dir="rtl">
                  إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلٌّ عِنْدَهُ بِأَجَلٍ مُسَمَّى
                </p>
                <p className="text-sm text-gray-500 italic mb-3">
                  "Inna lillahi ma akhadha, wa lahu ma a'ta, wa kullun 'indahu bi ajalin musamma"
                </p>
              </div>
              <p className="text-sm text-gray-700 font-medium border-l-4 border-emerald-500 pl-4 py-1">
                "Surely, Allah takes what is His, and what He gives is His, and to all things He has appointed a time."
              </p>
            </div>
          </div>
        </section>

        {/* Historical */}
        {pastJanaazah.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-gray-500 mb-4 border-b border-gray-200 pb-2">{t('janHistTitle')}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {pastJanaazah.map(j => (
                  <li key={j.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <p className="font-bold text-gray-700">{j.name}</p>
                    <p className="text-sm font-medium text-gray-400">{format(new Date(j.date), 'MMMM d, yyyy')}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md overflow-hidden rounded-2xl border-0 shadow-2xl">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white">
              <div>
                <h3 className="font-black text-gray-900 text-lg">{t('janFormTitle')}</h3>
                <p className="text-xs font-medium text-gray-500 mt-1">{t('janFormSub')}</p>
              </div>
              <button onClick={close} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500 hover:text-gray-900" />
              </button>
            </div>

            <CardContent className="p-6 bg-white">
              {done ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">{t('successTitle')}</h4>
                  <p className="text-gray-600 text-sm mb-8 px-4">{t('successJan')}</p>
                  <button onClick={close}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-md w-full">
                    {t('done')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Your Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('submitterName')} *</label>
                    <input required value={name} onChange={e => setName(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder={t('submitterName')} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('submitterPhone')} *</label>
                    <input required value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="+91 XXXXX XXXXX" />
                  </div>

                  {/* Upload notice */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('uploadNotice')}</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
                      <Upload size={28} className="text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600 text-center">
                        {file ? <span className="text-emerald-600 font-bold">{file.name}</span> : t('clickUpload')}
                      </span>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>

                  {/* Management contacts */}
                  <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-4 mt-2">
                    <p className="text-[11px] font-bold text-emerald-800 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={12} /> {t('mgmtContact')}
                    </p>
                    <div className="space-y-2">
                      {contacts.slice(0, 2).map(c => (
                        <div key={c.id} className="flex items-center justify-between bg-white/60 px-3 py-2 rounded-lg">
                          <span className="text-sm font-semibold text-gray-700">{c.role}</span>
                          <a href={`tel:${c.phone}`} className="text-sm text-emerald-700 hover:text-emerald-900 font-bold">{c.phone}</a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={close}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 text-sm transition-colors">
                      {t('cancel')}
                    </button>
                    <button type="submit"
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 text-sm shadow-md transition-colors">
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
