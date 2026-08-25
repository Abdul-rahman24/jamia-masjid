import { differenceInDays, format, isAfter, isBefore } from 'date-fns';
import { useLang } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/Card';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const NEXT_RAMADAN = {
  year: '1448 AH',
  start: new Date('2027-02-18'),
  end: new Date('2027-03-19'),
  eid: new Date('2027-03-20'),
};

const TIMETABLE = [
  { date: '2027-02-18', sehri: '05:05 AM', iftar: '06:20 PM' },
  { date: '2027-02-19', sehri: '05:04 AM', iftar: '06:20 PM' },
  { date: '2027-02-20', sehri: '05:04 AM', iftar: '06:21 PM' },
  // Truncated for UI example
];

export default function Ramadan() {
  const { t } = useLang();
  const today = new Date();
  
  const hasStarted = isAfter(today, NEXT_RAMADAN.start) && isBefore(today, NEXT_RAMADAN.end);
  const isOver = isAfter(today, NEXT_RAMADAN.end);
  const daysLeft = differenceInDays(NEXT_RAMADAN.start, today);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg,#1a0533,#2d1257,#4a1a8c)', minHeight: 360 }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                 style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDelay: `${i*0.3}s` }} />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4 animate-float">🌙</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t('ramTitle')}</h1>
          
          <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-10 py-8 backdrop-blur-sm shadow-xl mt-4">
            {hasStarted ? (
              <div>
                <h2 className="text-4xl font-black text-amber-300 mb-2">Ramadan Mubarak!</h2>
                <p className="text-purple-200">May Allah accept our fasting and prayers.</p>
              </div>
            ) : isOver ? (
              <div>
                <h2 className="text-4xl font-black text-amber-300 mb-2">Eid Mubarak!</h2>
                <p className="text-purple-200">Ramadan {NEXT_RAMADAN.year} has concluded.</p>
              </div>
            ) : (
              <div>
                <p className="text-purple-200 text-sm font-semibold mb-2 uppercase tracking-wider">{t('ramDaysLeft')}</p>
                <div className="text-6xl font-black text-amber-300 tracking-tight">{daysLeft}</div>
                <p className="text-purple-300 text-sm mt-2 font-medium">Days</p>
                <p className="text-purple-200/60 text-xs mt-3">Expected: {format(NEXT_RAMADAN.start, 'MMMM d, yyyy')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#F0FDF7"/></svg>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Taraweeh Info */}
        <Card className="border-t-4 border-t-violet-500 shadow-md">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Star className="text-violet-500" />
              Taraweeh Information
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-violet-50 rounded-xl p-5 border border-violet-100">
                <p className="text-xs font-bold text-violet-600 uppercase mb-1">Start Time</p>
                <p className="text-lg font-black text-gray-900">After Isha (8:15 PM)</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-5 border border-violet-100">
                <p className="text-xs font-bold text-violet-600 uppercase mb-1">Rak'ahs</p>
                <p className="text-lg font-black text-gray-900">20 Rak'ahs</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-5 border border-violet-100">
                <p className="text-xs font-bold text-violet-600 uppercase mb-1">Imam / Reciter</p>
                <p className="text-lg font-black text-gray-900">Hajrat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="text-[var(--color-primary)]" />
            {t('ramTimetable')}
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/50">
                    <th className="p-4 text-xs font-bold text-emerald-800 uppercase border-b">{t('date')}</th>
                    <th className="p-4 text-xs font-bold text-emerald-800 uppercase border-b">{t('ramSehriEnd')}</th>
                    <th className="p-4 text-xs font-bold text-emerald-800 uppercase border-b">{t('ramIftarMaghrib')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TIMETABLE.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-gray-900">{format(new Date(t.date), 'MMM d, EEEE')}</td>
                      <td className="p-4 text-gray-600 font-medium">{t.sehri}</td>
                      <td className="p-4 text-gray-600 font-medium">{t.iftar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t text-sm text-gray-500 text-center">
              Showing first few days. <Link to="/prayer-times" className="text-[var(--color-primary)] font-bold hover:underline">View full prayer timetable</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
