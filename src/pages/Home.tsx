import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Megaphone, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useData } from '../contexts/DataContext';
import { getNextPrayer, formatTime } from '../utils/prayerTimes';
import { toHijri, getUpcomingEvents } from '../utils/hijriDate';
import { useLang } from '../contexts/LanguageContext';
import ImageSlider from '../components/features/ImageSlider';

// ─── Scroll Reveal Hook ──────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}


// ─── Reveal Wrapper ──────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}


// ─── Floating Particles ──────────────────────────────────────────────────────
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 55 }).map((_, i) => (
      <div key={i} className="absolute rounded-full bg-white"
        style={{
          top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
          opacity: Math.random() * 0.5 + 0.1,
          animation: `hTwinkle ${(Math.random() * 4 + 2).toFixed(1)}s ease-in-out infinite`,
          animationDelay: `${(Math.random() * 4).toFixed(1)}s`,
        }} />
    ))}
  </div>
);

// ─── Mosque Silhouette ───────────────────────────────────────────────────────
const MosqueSilhouette = () => (
  <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg"
    className="absolute bottom-0 left-0 w-full opacity-[0.08] pointer-events-none select-none"
    preserveAspectRatio="xMidYMax slice">
    {/* Outer minarets */}
    <rect x="240" y="40" width="26" height="160" fill="white" />
    <polygon points="240,40 253,8 266,40" fill="white" />
    <ellipse cx="253" cy="7" rx="6" ry="9" fill="white" />
    <rect x="1174" y="40" width="26" height="160" fill="white" />
    <polygon points="1174,40 1187,8 1200,40" fill="white" />
    <ellipse cx="1187" cy="7" rx="6" ry="9" fill="white" />
    {/* Inner minarets */}
    <rect x="450" y="75" width="20" height="125" fill="white" />
    <polygon points="450,75 460,52 470,75" fill="white" />
    <rect x="970" y="75" width="20" height="125" fill="white" />
    <polygon points="970,75 980,52 990,75" fill="white" />
    {/* Side domes */}
    <path d="M410,200 L410,148 Q470,98 530,148 L530,200 Z" fill="white" />
    <path d="M910,200 L910,148 Q970,98 1030,148 L1030,200 Z" fill="white" />
    {/* Main dome */}
    <path d="M545,200 L545,95 Q720,0 895,95 L895,200 Z" fill="white" />
    {/* Base building */}
    <rect x="320" y="162" width="800" height="38" fill="white" />
    {/* Archway cutouts */}
    <ellipse cx="480" cy="182" rx="24" ry="20" fill="#054030" />
    <ellipse cx="720" cy="178" rx="32" ry="24" fill="#054030" />
    <ellipse cx="960" cy="182" rx="24" ry="20" fill="#054030" />
  </svg>
);


// ─── Prayer Colors & Arabic Names ────────────────────────────────────────────
const PRAYER_CONFIG: Record<string, { arabic: string; gradient: string; ring: string }> = {
  Fajr:    { arabic: 'الفجر',   gradient: 'from-indigo-600 to-blue-800',   ring: 'ring-indigo-400' },
  Dhuhr:   { arabic: 'الظهر',   gradient: 'from-amber-500 to-yellow-600',  ring: 'ring-amber-400' },
  Asr:     { arabic: 'العصر',   gradient: 'from-orange-500 to-red-600',    ring: 'ring-orange-400' },
  Maghrib: { arabic: 'المغرب',  gradient: 'from-rose-500 to-pink-700',     ring: 'ring-rose-400' },
  Isha:    { arabic: 'العشاء',  gradient: 'from-slate-700 to-gray-900',    ring: 'ring-slate-400' },
};

const EVENT_COLORS: Record<string, string> = {
  green: 'bg-emerald-400', amber: 'bg-amber-400', purple: 'bg-purple-400',
  blue: 'bg-blue-400', red: 'bg-red-400', orange: 'bg-orange-400',
};

// ─── Main Home Component ─────────────────────────────────────────────────────
export default function Home() {
  const { t } = useLang();
  const { masjidInfo, prayerTimes, jumuahInfo, janaazah: allJanaazah, announcements } = useData();
  const janaazah = allJanaazah.filter(j => j.active);
  const hijri = toHijri();
  const events = getUpcomingEvents(5);

  const mainPrayers = prayerTimes.filter(p => !['Sunrise', 'Sunset'].includes(p.name));
  const sunrise = prayerTimes.find(p => p.name === 'Sunrise');
  const sunset = prayerTimes.find(p => p.name === 'Sunset');
  const jumuah = jumuahInfo.sessions[0];

  // Next prayer detection (live, updates every second)
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const result = getNextPrayer(prayerTimes);
      if (result) {
        setNextPrayerName(result.prayer.name);
        const sec = result.secondsRemaining;
        setCountdown({
          h: String(Math.floor(sec / 3600)).padStart(2, '0'),
          m: String(Math.floor((sec % 3600) / 60)).padStart(2, '0'),
          s: String(sec % 60).padStart(2, '0'),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerTimes]);


  return (
    <div>
      {/* ── CSS Animations ──────────────────────────────────────── */}
      <style>{`
        @keyframes hTwinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
        @keyframes hFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes hShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes hPulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.5)} 60%{box-shadow:0 0 0 14px rgba(212,175,55,0)} }
        @keyframes hSlideLeft { 0%{opacity:0;transform:translateX(-30px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes hSlideRight { 0%{opacity:0;transform:translateX(30px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes hFadeDown { 0%{opacity:0;transform:translateY(-20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes hFadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes hGoldBorder { 0%,100%{border-color:rgba(212,175,55,0.4)} 50%{border-color:rgba(212,175,55,1)} }
        .h-slide-left { animation: hSlideLeft 0.8s ease forwards; }
        .h-slide-right { animation: hSlideRight 0.8s ease forwards; }
        .h-fade-up-1 { animation: hFadeUp 0.7s 0.1s ease both; }
        .h-fade-up-2 { animation: hFadeUp 0.7s 0.3s ease both; }
        .h-fade-up-3 { animation: hFadeUp 0.7s 0.5s ease both; }
        .h-fade-down { animation: hFadeDown 0.6s ease both; }
        .h-float { animation: hFloat 4s ease-in-out infinite; }
        .h-pulse-glow { animation: hPulseGlow 2s ease-in-out infinite; }
        .h-gold-border { animation: hGoldBorder 2s ease-in-out infinite; border-width: 2px; }
        .h-shimmer-text { background: linear-gradient(90deg,#D4AF37,#F0CC5A,#D4AF37,#F0CC5A); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation: hShimmer 3s linear infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #021a11 0%, #054030 35%, #0D7A4E 65%, #065235 100%)', minHeight: 520 }}>
        <Particles />
        <MosqueSilhouette />

        {/* Gold top accent line */}
        <div className="h-1 w-full absolute top-0" style={{ background: 'linear-gradient(90deg,#D4AF37,#F0CC5A,#D4AF37)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <div className="text-center md:text-left max-w-xl">
              {/* Location badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-emerald-200 text-xs font-bold mb-5 h-fade-down">
                <MapPin size={13} /> Kattumavadi, Nagapattinam, Tamil Nadu
              </div>


              {/* Masjid name — normal font, slightly smaller */}
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-xl h-fade-up-2">
                {masjidInfo.name}
              </h1>

              {/* Mission text */}
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed h-fade-up-3 opacity-90">
                {masjidInfo.mission}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start h-fade-up-3">
                <Link to="/prayer-times"
                  className="bg-white text-[var(--color-primary)] px-7 py-3.5 rounded-full font-black shadow-xl hover:shadow-white/20 hover:scale-105 transition-all text-sm">
                  🕐 {t('prayerTimes')}
                </Link>
                <Link to="/about#location"
                  className="border-2 border-white/50 text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 hover:border-white transition-all text-sm flex items-center justify-center gap-2">
                  <MapPin size={17} /> {t('getDirections')}
                </Link>
              </div>
            </div>

            {/* Right: Hijri Date + Next Prayer teaser */}
            <div className="flex flex-col items-center gap-5 h-slide-right flex-shrink-0">
              {/* Hijri Date Card */}
              <div className="h-float">
                <div className="w-48 h-48 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-md"
                  style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)' }}>
                  <div className="text-5xl font-black h-shimmer-text mb-0.5">{hijri.day}</div>
                  <div className="text-white text-sm font-bold px-3 leading-tight">{hijri.monthName}</div>
                  <div className="text-emerald-300 text-xs mt-1">{hijri.year} AH</div>
                  <div className="w-12 h-px bg-white/20 my-2" />
                  <div className="text-emerald-100 text-xs">{format(new Date(), 'MMM d, yyyy')}</div>
                </div>
              </div>

              {/* Next Prayer teaser */}
              {nextPrayerName && (
                <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center backdrop-blur-sm">
                  <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Next Prayer</p>
                  <p className="text-white font-black text-lg">{nextPrayerName}</p>
                  <p className="text-amber-300 text-sm font-mono font-bold">{countdown.h}:{countdown.m}:{countdown.s}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 55" fill="none" preserveAspectRatio="none">
            <path d="M0,30 C360,55 1080,5 1440,30 L1440,55 L0,55 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. MASJID GLIMPSES  (at the top, as requested)
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-6">
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Masjid Glimpses
            </h2>
            <p className="text-gray-500 mt-1 text-sm">A window into our community</p>
          </Reveal>
          <Reveal delay={100}>
            <ImageSlider />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. LIVE PRAYER BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #065235 0%, #0D7A4E 50%, #059669 100%)' }}>
              {/* Top gold bar */}
              <div className="h-1" style={{ background: 'linear-gradient(90deg,#D4AF37,#F0CC5A,#D4AF37)' }} />
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Next prayer info */}
                <div>
                  <p className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-1">{t('nextPrayer')}</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-5xl font-black text-white drop-shadow">{nextPrayerName || '—'}</h2>
                    {nextPrayerName && mainPrayers.find(p => p.name === nextPrayerName) && (
                      <span className="text-xl text-emerald-200 font-semibold">
                        {formatTime(mainPrayers.find(p => p.name === nextPrayerName)!.adhan)}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-200 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
                </div>
                {/* Countdown */}
                <div className="text-center">
                  <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-3">{t('startsIn')}</p>
                  <div className="flex items-center gap-2">
                    {[['h', countdown.h], ['m', countdown.m], ['s', countdown.s]].map(([lbl, val]) => (
                      <div key={lbl} className="flex flex-col items-center">
                        <div className="bg-black/20 border border-white/10 rounded-xl w-16 h-16 flex items-center justify-center">
                          <span className="text-3xl font-black text-white tabular-nums">{val}</span>
                        </div>
                        <span className="text-emerald-300 text-[10px] font-bold mt-1 uppercase">{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Sunrise / Sunset */}
                <div className="flex gap-6 text-center bg-black/20 rounded-2xl px-5 py-3 border border-white/10">
                  <div>
                    <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-1">🌅 Sunrise</p>
                    <p className="text-white font-black">{sunrise ? formatTime(sunrise.adhan) : '—'}</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-1">🌇 Sunset</p>
                    <p className="text-white font-black">{sunset ? formatTime(sunset.adhan) : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. PRAYER TIME CARDS (5 cards + Jumu'ah)
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Today's Prayer Times
            </h2>
          </Reveal>

          {/* 5 Prayer Cards */}
          <Reveal delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
              {mainPrayers.map((prayer, idx) => {
                const cfg = PRAYER_CONFIG[prayer.name] || { arabic: '', gradient: 'from-gray-600 to-gray-800', ring: 'ring-gray-400' };
                const isNext = prayer.name === nextPrayerName;
                return (
                  <div
                    key={prayer.name}
                    className={`relative rounded-3xl p-5 text-white overflow-hidden transition-all duration-300 bg-gradient-to-br ${cfg.gradient} ${
                      isNext ? `ring-4 ${cfg.ring} h-pulse-glow shadow-2xl scale-105` : 'shadow-md hover:-translate-y-1 hover:shadow-xl'
                    }`}
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    {/* Active badge */}
                    {isNext && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Next
                      </div>
                    )}
                    <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1" style={{ fontFamily: "'Amiri', serif", direction: 'rtl', textAlign: 'right' }}>
                      {cfg.arabic}
                    </div>
                    <h3 className="text-xl font-black mb-3">{prayer.name}</h3>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Adhan</p>
                      <p className="text-lg font-black">{formatTime(prayer.adhan)}</p>
                    </div>
                    {prayer.iqamah && (
                      <div className="mt-2">
                        <p className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Iqamah</p>
                        <p className="text-sm font-bold opacity-90">{formatTime(prayer.iqamah)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Jumu'ah Feature Card */}
          {jumuah && (
            <Reveal delay={200}>
              <div className="rounded-3xl overflow-hidden shadow-xl h-gold-border"
                style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #3d2600 50%, #1a0e00 100%)', border: '2px solid #D4AF37' }}>
                <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                      ⭐
                    </div>
                    <div>
                      <h3 className="h-shimmer-text text-2xl font-black">Jumu'ah Mubarak</h3>
                      <p className="text-amber-200/60 text-sm mt-0.5">Friday Congregational Prayer</p>
                      {jumuah.khateeb && (
                        <p className="text-amber-300 text-xs font-bold mt-1">Khateeb: {jumuah.khateeb}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-6 text-center">
                    <div className="bg-white/5 border border-amber-400/20 rounded-2xl px-6 py-3">
                      <p className="text-amber-400/70 text-[10px] font-black uppercase tracking-widest mb-1">Khutbah</p>
                      <p className="text-white font-black text-2xl">{formatTime(jumuah.khutbahTime)}</p>
                    </div>
                    <div className="bg-white/5 border border-amber-400/20 rounded-2xl px-6 py-3">
                      <p className="text-amber-400/70 text-[10px] font-black uppercase tracking-widest mb-1">Jama'ah</p>
                      <p className="text-amber-300 font-black text-2xl">{formatTime(jumuah.jamaahTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. ANNOUNCEMENTS (Replaces Services)
      ═══════════════════════════════════════════════════════════ */}
      {announcements.filter(a => a.active).length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
                <Megaphone className="text-[var(--color-primary)]" size={32} />
                {t('announcements') || 'Announcements'}
              </h2>
              <p className="text-gray-500 mt-2">Important news and updates from the Masjid</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.filter(a => a.active).slice(0, 3).map((a, idx) => {
                let descText = a.description;
                let img = null;
                try {
                  const parsed = JSON.parse(a.description);
                  descText = parsed.text;
                  img = parsed.image;
                } catch(e) {}

                return (
                  <Reveal key={a.id} delay={idx * 100}>
                    <div className={`h-full border-t-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white flex flex-col ${a.priority === 'Urgent' ? 'border-t-red-500' : a.priority === 'Important' ? 'border-t-orange-500' : 'border-t-[var(--color-primary)]'}`}>
                      {img && (
                        <div 
                          className="w-full h-48 bg-gray-100 overflow-hidden border-b border-gray-100 shrink-0 cursor-pointer relative group"
                          onClick={() => setSelectedImage(img)}
                        >
                          <img src={img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white font-bold bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-opacity">View Image</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{a.category}</span>
                          <span className="text-xs font-semibold text-gray-400">{format(new Date(a.publishedDate), 'MMM d, yyyy')}</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">{a.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{descText}</p>
                        <Link to="/announcements" className="text-[var(--color-primary)] font-bold text-sm hover:underline mt-auto">Read More &rarr;</Link>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            
            {announcements.filter(a => a.active).length > 3 && (
              <div className="text-center mt-10">
                <Link to="/announcements" className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                  View All Announcements
                </Link>
              </div>
            )}
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════════════════
          7. ISLAMIC EVENTS TIMELINE (Horizontal Scroll)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Upcoming Islamic Events
              </h2>
              <p className="text-gray-500 text-sm mt-1">Important dates on the Islamic calendar</p>
            </div>
            <Link to="/ramadan" className="text-sm font-bold text-[var(--color-primary)] hover:underline whitespace-nowrap flex items-center gap-1">
              Full Calendar <ArrowRight size={14} />
            </Link>
          </Reveal>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {events.map((ev, idx) => {
              const daysLeft = differenceInDays(ev.gregorianDate, new Date());
              const dotColor = EVENT_COLORS[ev.color] || 'bg-emerald-400';
              return (
                <Reveal key={idx} delay={idx * 80} className="flex-shrink-0 w-64 snap-start">
                  <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all h-full">
                    <div className={`w-3 h-3 rounded-full ${dotColor} mb-3 shadow-sm`} />
                    <h3 className="font-black text-gray-900 text-base leading-tight mb-1">{ev.name}</h3>
                    <p className="text-[var(--color-primary)] text-sm font-semibold mb-2">
                      {format(ev.gregorianDate, 'MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">{ev.description}</p>
                    <div className={`inline-block text-xs font-black px-3 py-1 rounded-full ${
                      daysLeft <= 7 ? 'bg-red-100 text-red-700' :
                      daysLeft <= 30 ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {daysLeft <= 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days away`}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. JANAAZAH ALERTS (only when active)
      ═══════════════════════════════════════════════════════════ */}
      {janaazah.length > 0 && (
        <section className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-white font-black text-lg uppercase tracking-wide">Janaazah Notices</h2>
              </div>
              <div
                className="text-center text-2xl md:text-3xl mb-8 text-white/60"
                style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
              >
                إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {janaazah.map(j => (
                  <div key={j.id} className="bg-white/5 border-l-4 border-l-amber-400 rounded-2xl p-5">
                    <p className="text-amber-400/70 text-[10px] font-black uppercase tracking-widest mb-2">Inna lillahi wa inna ilayhi raji'un</p>
                    <h4 className="text-white font-black text-lg mb-3">{j.name}</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><span className="text-gray-500 font-semibold">Date:</span> {format(new Date(j.date), 'MMM d, yyyy')}</p>
                      <p><span className="text-gray-500 font-semibold">Prayer:</span> {formatTime(j.prayerTime)}</p>
                      <p><span className="text-gray-500 font-semibold">Venue:</span> {j.prayerLocation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2">
            <X size={28} />
          </button>
          <img 
            src={selectedImage} 
            alt="Announcement Full View" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
