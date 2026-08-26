import { useState, useEffect, useMemo } from 'react';
import { format, differenceInDays, isAfter, isBefore, parseISO, differenceInSeconds } from 'date-fns';
import { Star, Calendar, Moon, Sparkles, Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent } from '../components/ui/Card';

// ─── Helpers ────────────────────────────────────────────────────────────────
function parseTime12(timeStr: string): Date {
  const today = new Date();
  if (!timeStr) return today;
  const [time, meridiem] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
}

function formatCountdown(secs: number): { h: string; m: string; s: string } {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
  };
}

// ─── Stars background ─────────────────────────────────────────────────────
const Stars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(60)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          opacity: Math.random() * 0.7 + 0.3,
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
      @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      .animate-float { animation: floatUp 4s ease-in-out infinite; }
      .animate-shimmer { background-size:200% auto; animation: shimmer 4s linear infinite; }
      .fade-slide { animation: fadeSlideUp 0.7s ease forwards; }
      .fade-slide-d1 { animation: fadeSlideUp 0.7s 0.1s ease forwards; opacity:0; }
      .fade-slide-d2 { animation: fadeSlideUp 0.7s 0.2s ease forwards; opacity:0; }
      .fade-slide-d3 { animation: fadeSlideUp 0.7s 0.3s ease forwards; opacity:0; }
      .fade-slide-d4 { animation: fadeSlideUp 0.7s 0.4s ease forwards; opacity:0; }
    `}</style>
  </div>
);

// ─── Countdown Timer (Sehri / Iftar) ─────────────────────────────────────
function LiveCountdown({ todayRow }: { todayRow: { sehri: string; iftar: string } }) {
  const [secsLeft, setSecsLeft] = useState(0);
  const [mode, setMode] = useState<'sehri' | 'iftar' | 'done'>('sehri');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const sehriTime = parseTime12(todayRow.sehri);
      const iftarTime = parseTime12(todayRow.iftar);

      if (isBefore(now, sehriTime)) {
        setMode('sehri');
        setSecsLeft(differenceInSeconds(sehriTime, now));
      } else if (isBefore(now, iftarTime)) {
        setMode('iftar');
        setSecsLeft(differenceInSeconds(iftarTime, now));
      } else {
        setMode('done');
        setSecsLeft(0);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [todayRow]);

  const { h, m, s } = formatCountdown(secsLeft);
  const label = mode === 'sehri' ? 'Sehri Ends In' : mode === 'iftar' ? 'Iftar In' : "Jazakallah! Today's fast is complete";

  const gradMap = {
    sehri: 'from-indigo-500 to-purple-700',
    iftar: 'from-amber-400 to-orange-600',
    done: 'from-emerald-500 to-teal-700',
  };

  return (
    <div className={`rounded-3xl p-6 text-center text-white bg-gradient-to-br ${gradMap[mode]} shadow-2xl fade-slide-d2`}>
      <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">{label}</p>
      {mode !== 'done' ? (
        <div className="flex justify-center gap-3">
          {[['h', h], ['m', m], ['s', s]].map(([lbl, val]) => (
            <div key={lbl} className="flex flex-col items-center">
              <div className="bg-black/20 rounded-2xl px-4 py-3 min-w-[64px]">
                <span className="text-4xl font-black tabular-nums tracking-tighter">{val}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{lbl}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-2xl font-black">🌙 Alhamdulillah!</div>
      )}
      <div className="mt-4 flex justify-between text-xs opacity-70 font-semibold px-2">
        <span>Sehri: {todayRow.sehri}</span>
        <span>Iftar: {todayRow.iftar}</span>
      </div>
    </div>
  );
}

// ─── Days-to-Ramadan Counter ──────────────────────────────────────────────
function DaysCounter({ startDate, year }: { startDate: string; year: string }) {
  const daysLeft = differenceInDays(parseISO(startDate), new Date());
  return (
    <div className="text-center fade-slide-d2">
      <p className="text-purple-200 text-sm font-bold uppercase tracking-widest mb-2">Ramadan Begins In</p>
      <div
        className="text-8xl font-black tracking-tight animate-shimmer"
        style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {daysLeft}
      </div>
      <p className="text-purple-200 mt-2 text-sm font-medium">days</p>
      <p className="text-purple-300/60 text-xs mt-3">
        Expected: {format(parseISO(startDate), 'MMMM d, yyyy')} — {year}
      </p>
    </div>
  );
}

// ─── Zakat Calculator ─────────────────────────────────────────────────────
function ZakatCalc({ goldPricePerGram, nisabGrams }: { goldPricePerGram?: number; nisabGrams: number }) {
  const [savings, setSavings] = useState('');
  const [goldRate, setGoldRate] = useState(goldPricePerGram || 6500);
  const nisabValue = goldRate * nisabGrams;
  const savingsNum = parseFloat(savings.replace(/,/g, '')) || 0;
  const isNisab = savingsNum >= nisabValue;
  const zakat = isNisab ? savingsNum * 0.025 : 0;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Total Savings (₹)</label>
        <input
          type="number"
          value={savings}
          onChange={e => setSavings(e.target.value)}
          placeholder="e.g. 500000"
          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-amber-400 rounded-xl outline-none text-lg font-bold transition"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Gold Rate (₹ per gram)</label>
        <input
          type="number"
          value={goldRate}
          onChange={e => setGoldRate(Number(e.target.value))}
          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-amber-400 rounded-xl outline-none transition"
        />
      </div>

      <div className={`rounded-2xl p-5 text-center transition-all ${isNisab ? 'bg-amber-50 border-2 border-amber-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Nisab Threshold</p>
        <p className="text-lg font-black text-gray-900">₹{nisabValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        <p className="text-xs text-gray-400 mt-1">{nisabGrams}g gold × ₹{goldRate}/g</p>
      </div>

      {savings && (
        <div className={`rounded-2xl p-6 text-center ${isNisab ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {isNisab ? (
            <>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Zakat Due (2.5%)</p>
              <p className="text-4xl font-black">₹{zakat.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              <p className="text-xs opacity-70 mt-2">May Allah accept your Zakat 🤲</p>
            </>
          ) : (
            <>
              <p className="font-bold">Below Nisab Threshold</p>
              <p className="text-sm opacity-70 mt-1">Zakat is not yet obligatory on this amount.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function Ramadan() {
  const { ramadanSettings: rs } = useData();
  const today = new Date();

  const isActive = isAfter(today, parseISO(rs.startDate)) && isBefore(today, parseISO(rs.endDate));
  const isOver = isAfter(today, parseISO(rs.endDate));

  // Today's timetable row
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayRow = rs.timetable.find(t => t.date === todayStr);

  // Dua of the day (cycle by day of Ramadan or day of year)
  const duaOfDay = useMemo(() => {
    if (!rs.duas.length) return null;
    if (isActive && todayRow) {
      const ramadanDay = differenceInDays(today, parseISO(rs.startDate)) + 1;
      return rs.duas.find(d => d.day === ramadanDay) || rs.duas[0];
    }
    const idx = new Date().getDate() % rs.duas.length;
    return rs.duas[idx];
  }, [rs.duas, isActive, todayRow]);

  const [showFullTimetable, setShowFullTimetable] = useState(false);
  const displayedRows = showFullTimetable ? rs.timetable : rs.timetable.slice(0, 10);

  const REMINDER_COLORS = ['from-emerald-400 to-teal-600','from-violet-400 to-purple-600','from-amber-400 to-orange-500','from-rose-400 to-pink-600','from-blue-400 to-indigo-600','from-cyan-400 to-sky-600'];

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[480px] flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg,#0d001a 0%,#1e0540 40%,#2d1257 70%,#0d1b4b 100%)' }}
      >
        <Stars />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          <div className="text-7xl mb-4 animate-float">🌙</div>
          <h1
            className="text-5xl md:text-7xl font-black text-white mb-2 fade-slide"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '-0.02em' }}
          >
            Ramadan
          </h1>
          <p className="text-purple-300 text-lg mb-10 fade-slide-d1 font-medium">{rs.year}</p>

          <div className="max-w-md mx-auto">
            {isOver ? (
              <div className="fade-slide-d2 text-center">
                <h2 className="text-4xl font-black text-amber-300 mb-2">Eid Mubarak! 🎉</h2>
                <p className="text-purple-200">Ramadan {rs.year} has concluded. May Allah accept our prayers.</p>
              </div>
            ) : isActive && todayRow ? (
              <LiveCountdown todayRow={todayRow} />
            ) : isActive ? (
              <div className="fade-slide-d2 bg-white/10 rounded-3xl p-6 text-white backdrop-blur-sm">
                <h2 className="text-3xl font-black text-amber-300 mb-1">Ramadan Mubarak! 🌙</h2>
                <p className="text-purple-200">May Allah accept our fasting and prayers.</p>
              </div>
            ) : (
              <DaysCounter startDate={rs.startDate} year={rs.year} />
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#fafafa" />
          </svg>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* ── Islamic Timeline ─────────────────────────────────────── */}
          {rs.keyEvents.length > 0 && (
            <section>
              <SectionHeader icon={<Calendar className="text-emerald-500" />} title="Ramadan Calendar" subtitle="Key dates and events this Ramadan" />
              <div className="relative mt-8">
                <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-amber-300 to-purple-300 hidden md:block" />
                <div className="space-y-6">
                  {rs.keyEvents.map((ev, idx) => (
                    <div key={ev.id} className={`relative flex md:items-center gap-4 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="hidden md:flex w-1/2 justify-end md:pr-8 md:pl-0 pl-8">
                        {idx % 2 === 0 && (
                          <EventCard ev={ev} />
                        )}
                      </div>
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white shadow-lg z-10"
                        style={{ background: ev.highlight ? 'linear-gradient(135deg,#f59e0b,#ea580c)' : 'linear-gradient(135deg,#10b981,#0d9488)' }} />
                      <div className="hidden md:flex w-1/2 md:pl-8">
                        {idx % 2 !== 0 && <EventCard ev={ev} />}
                      </div>
                      {/* Mobile: always left */}
                      <div className="md:hidden flex items-start gap-3 w-full pl-6 border-l-2 border-emerald-200">
                        <EventCard ev={ev} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Sehri / Iftar Timetable ──────────────────────────────── */}
          {rs.timetable.length > 0 && (
            <section>
              <SectionHeader icon={<Calendar className="text-[var(--color-primary)]" />} title="Sehri & Iftar Timetable" subtitle={`Full 30-day schedule for Ramadan ${rs.year}`} />
              <div className="mt-8 bg-white rounded-3xl shadow-xl ring-1 ring-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg,#054030,#0D7A4E)' }}>
                        <th className="p-4 text-xs font-bold text-emerald-100 uppercase tracking-widest">Day</th>
                        <th className="p-4 text-xs font-bold text-emerald-100 uppercase tracking-widest">Date</th>
                        <th className="p-4 text-xs font-bold text-emerald-100 uppercase tracking-widest">Sehri Ends</th>
                        <th className="p-4 text-xs font-bold text-emerald-100 uppercase tracking-widest">Iftar / Maghrib</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {displayedRows.map((row) => {
                        const isToday = row.date === todayStr;
                        return (
                          <tr key={row.day} className={`transition-colors ${isToday ? 'bg-amber-50 ring-2 ring-inset ring-amber-200' : 'hover:bg-gray-50'}`}>
                            <td className="p-4">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${isToday ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                {row.day}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-gray-800 text-sm">{format(parseISO(row.date), 'EEE, MMM d')}</td>
                            <td className="p-4 text-indigo-700 font-bold text-sm">{row.sehri}</td>
                            <td className="p-4 text-amber-700 font-bold text-sm">{row.iftar}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {rs.timetable.length > 10 && (
                  <button
                    onClick={() => setShowFullTimetable(v => !v)}
                    className="w-full py-4 text-sm font-bold text-[var(--color-primary)] hover:bg-gray-50 flex items-center justify-center gap-2 transition border-t"
                  >
                    {showFullTimetable ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> Show All 30 Days</>}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* ── Taraweeh Info ─────────────────────────────────────────── */}
          <section>
            <SectionHeader icon={<Star className="text-violet-500" />} title="Taraweeh Salah" subtitle="Night prayers at the masjid during Ramadan" />
            <div className="mt-8">
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { label: 'Start Time', value: rs.taraweeh.time, color: 'bg-violet-50 border-violet-100 text-violet-600' },
                  { label: "Rak'ahs", value: rs.taraweeh.rakaat, color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
                  { label: 'Imam / Reciter', value: rs.taraweeh.imam, color: 'bg-purple-50 border-purple-100 text-purple-600' },
                ].map(item => (
                  <div key={item.label} className={`rounded-2xl p-5 border ${item.color.split(' ').slice(0,2).join(' ')} shadow-sm`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${item.color.split(' ')[2]}`}>{item.label}</p>
                    <p className="text-xl font-black text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {rs.taraweeh.specialNights.length > 0 && (
                <div className="mt-5 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
                  <p className="text-xs font-black uppercase tracking-widest text-violet-600 mb-3">Special Nights</p>
                  <div className="flex flex-wrap gap-2">
                    {rs.taraweeh.specialNights.map((night, i) => (
                      <span key={i} className="bg-violet-100 text-violet-800 text-sm font-bold px-3 py-1 rounded-full">{night}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Last 10 Nights ───────────────────────────────────────── */}
          {rs.importantNights.length > 0 && (
            <section>
              <SectionHeader icon={<Moon className="text-amber-500" />} title="Last 10 Nights" subtitle="The most blessed nights of the year — seek Laylatul Qadr" />
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rs.importantNights.map((night) => {
                  const isKadr = night.night === 27;
                  return (
                    <div
                      key={night.night}
                      className={`relative rounded-3xl p-6 overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl ${
                        isKadr
                          ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 text-white shadow-amber-200 shadow-lg'
                          : 'bg-white ring-1 ring-gray-100 shadow-sm'
                      }`}
                    >
                      {isKadr && <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,white,transparent)]" />}
                      <div className={`text-4xl font-black mb-1 ${isKadr ? 'text-white' : 'text-gray-200'}`}>{night.night}</div>
                      <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isKadr ? 'text-white/70' : 'text-amber-600'}`}>Night</p>
                      <h3 className={`font-black text-lg mb-2 leading-tight ${isKadr ? 'text-white' : 'text-gray-900'}`}>{night.title}</h3>
                      <p className={`text-sm leading-relaxed ${isKadr ? 'text-white/80' : 'text-gray-500'}`}>{night.description}</p>
                      {isKadr && <div className="absolute top-4 right-4 text-3xl">⭐</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Dua of the Day ───────────────────────────────────────── */}
          {duaOfDay && (
            <section>
              <SectionHeader icon={<BookOpen className="text-teal-500" />} title={isActive ? `Dua — Day ${differenceInDays(today, parseISO(rs.startDate)) + 1}` : 'Daily Dua'} subtitle="Recite with sincerity and reflection" />
              <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl">
                <div style={{ background: 'linear-gradient(135deg,#054030 0%,#0D7A4E 50%,#065235 100%)' }} className="p-8 md:p-12">
                  <p
                    className="text-2xl md:text-4xl leading-loose text-right text-white mb-6"
                    style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
                  >
                    {duaOfDay.arabic}
                  </p>
                  <div className="border-t border-white/20 pt-6 space-y-2">
                    <p className="text-emerald-200 text-sm md:text-base font-medium italic leading-relaxed">{duaOfDay.transliteration}</p>
                    <p className="text-white font-bold text-base md:text-lg leading-relaxed">{duaOfDay.translation}</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 font-medium">This dua changes each day of Ramadan</p>
            </section>
          )}

          {/* ── Ramadan Reminders ─────────────────────────────────────── */}
          {rs.reminders.length > 0 && (
            <section>
              <SectionHeader icon={<Sparkles className="text-rose-500" />} title="Ramadan Reminders" subtitle="Spiritual tips to make the most of this blessed month" />
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rs.reminders.map((rem, idx) => (
                  <div
                    key={rem.id}
                    className={`rounded-3xl p-6 bg-gradient-to-br ${REMINDER_COLORS[idx % REMINDER_COLORS.length]} text-white shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all`}
                  >
                    <div className="text-4xl mb-3">{rem.icon}</div>
                    <h3 className="font-black text-lg mb-2">{rem.title}</h3>
                    <p className="text-sm leading-relaxed opacity-90">{rem.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Zakat Calculator ─────────────────────────────────────── */}
          <section>
            <SectionHeader icon={<Zap className="text-amber-500" />} title="Zakat Calculator" subtitle="Calculate your obligatory annual charity" />
            <Card className="mt-8 border-0 shadow-xl ring-1 ring-gray-100 rounded-3xl overflow-hidden">
              <div className="p-2 text-center text-xs font-bold bg-amber-50 text-amber-700 border-b border-amber-100">
                Nisab is based on {rs.nisabGoldGrams}g of gold. Update the gold rate below to get today's accurate value.
              </div>
              <CardContent className="p-6 md:p-8">
                <ZakatCalc nisabGrams={rs.nisabGoldGrams} />
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5 border-b border-gray-200 pb-5">
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function EventCard({ ev }: { ev: { label: string; date: string; hijriDate: string; highlight: boolean } }) {
  return (
    <div className={`rounded-2xl p-4 w-full max-w-xs shadow-sm ring-1 ${ev.highlight ? 'ring-amber-200 bg-amber-50' : 'ring-gray-100 bg-white'}`}>
      <p className={`text-xs font-black uppercase tracking-widest mb-1 ${ev.highlight ? 'text-amber-600' : 'text-[var(--color-primary)]'}`}>
        {ev.hijriDate}
      </p>
      <p className="font-black text-gray-900 text-base">{ev.label}</p>
      <p className="text-xs text-gray-500 mt-1 font-medium">{format(parseISO(ev.date), 'EEE, MMMM d, yyyy')}</p>
    </div>
  );
}

