import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { formatTime } from '../utils/prayerTimes';
import { toHijri } from '../utils/hijriDate';
import NextPrayerCard from '../components/features/NextPrayerCard';
import { Calendar as CalendarIcon, Sunrise, Sunset, Star } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { format } from 'date-fns';

export default function PrayerTimes() {
  const { t } = useLang();
  const times = api.getPrayerTimes();
  const jumuahInfo = api.getJumuahInfo();
  const hijri = toHijri();

  const mainPrayers = times.filter(p => p.name !== 'Sunrise' && p.name !== 'Sunset');
  const sunrise = times.find(p => p.name === 'Sunrise');
  const sunset = times.find(p => p.name === 'Sunset');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{t('prayerTimes')}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-medium">
          <span className="flex items-center gap-1.5 bg-gray-100 px-4 py-1.5 rounded-full"><CalendarIcon size={16} /> {format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full border border-emerald-200">
            <CalendarIcon size={16} /> {hijri.day} {hijri.monthName} {hijri.year} AH
          </span>
        </div>
      </div>

      <div className="mb-10"><NextPrayerCard /></div>

      <Card className="overflow-hidden shadow-xl border-0 ring-1 ring-gray-100 rounded-3xl mb-12 flex flex-col">
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#0D7A4E,#10B981)' }} />
        
        <CardContent className="p-0 bg-white flex flex-col flex-1">
          {/* Sunrise / Sunset Separated Row */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 bg-orange-50/20">
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 hover:bg-orange-50/50 transition-colors">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider">
                <Sunrise size={20} /> Sunrise
              </div>
              <span className="text-2xl font-black text-gray-900">{sunrise ? formatTime(sunrise.adhan) : '—'}</span>
            </div>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 hover:bg-orange-50/50 transition-colors">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider">
                <Sunset size={20} /> Sunset
              </div>
              <span className="text-2xl font-black text-gray-900">{sunset ? formatTime(sunset.adhan) : '—'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 border-b border-gray-100">
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest">{t('prayer')}</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest">{t('adhan')}</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-right">{t('jamaah')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mainPrayers.map((p) => (
                  <tr key={p.name} className="hover:bg-emerald-50/40 transition-colors group">
                    <td className="py-6 px-8 font-black text-gray-900 text-xl group-hover:text-[var(--color-primary)] transition-colors">
                      {p.name}
                    </td>
                    <td className="py-6 px-8 font-semibold text-gray-500 text-lg">
                      {formatTime(p.adhan)}
                    </td>
                    <td className="py-6 px-8 text-right font-black text-2xl text-[var(--color-primary)]">
                      {p.iqamah ? formatTime(p.iqamah) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Smaller, Perfect Jumu'ah Section Integrated below the table */}
          <div className="bg-[var(--color-primary-dark)] text-white p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto border-t-4 border-emerald-600">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-2xl shadow-inner border border-white/5">
                <Star size={32} className="text-amber-300"/>
              </div>
              <div>
                <h4 className="font-black text-2xl leading-none mb-1">Jumu'ah Mubarak</h4>
                <p className="text-emerald-200 text-sm font-medium">Friday Congregational Prayer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-10 bg-black/20 px-6 sm:px-10 py-4 rounded-2xl border border-white/10 shadow-inner">
              <div className="text-center">
                <p className="text-xs text-emerald-300 uppercase tracking-widest font-bold mb-1">Khutbah</p>
                <p className="font-black text-3xl leading-none">{formatTime(jumuahInfo.sessions[0].khutbahTime)}</p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <p className="text-xs text-emerald-300 uppercase tracking-widest font-bold mb-1">Jama'ah</p>
                <p className="font-black text-3xl text-emerald-100 leading-none">{formatTime(jumuahInfo.sessions[0].jamaahTime)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
