import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getNextPrayer, formatTime } from '../../utils/prayerTimes';
import type { NextPrayerResult } from '../../utils/prayerTimes';
import { useLang } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

export default function NextPrayerCard() {
  const { prayerTimes } = useData();
  const [prayers] = useState(() => prayerTimes);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerResult | null>(null);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    const update = () => {
      const result = getNextPrayer(prayers);
      setNextPrayer(result);
      if (result) {
        const sec = result.secondsRemaining;
        setH(Math.floor(sec / 3600));
        setM(Math.floor((sec % 3600) / 60));
        setS(sec % 60);
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [prayers]);

  if (!nextPrayer) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="prayer-glow relative rounded-2xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #065235 0%, #0D7A4E 50%, #059669 100%)' }}>

      {/* animated shimmer overlay */}
      <div className="shimmer absolute inset-0 pointer-events-none z-0" />

      {/* Islamic geometric pattern */}
      <div className="pattern-bg absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: prayer info */}
        <div className="animate-fade-up">
          <p className="text-emerald-200 text-xs font-bold tracking-widest uppercase mb-2">
            {t('nextPrayer')}
          </p>
          <div className="flex items-baseline gap-4 mb-2">
            <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">
              {nextPrayer.prayer.name}
            </h2>
            <span className="text-2xl font-semibold text-emerald-100">
              {formatTime(nextPrayer.prayer.adhan)}
            </span>
          </div>
          {nextPrayer.prayer.iqamah && (
            <p className="text-emerald-200 text-sm font-medium">
              {t('jamaah')} · {formatTime(nextPrayer.prayer.iqamah)}
            </p>
          )}
          {nextPrayer.isTomorrow && (
            <span className="inline-block mt-2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              {t('tomorrow')}
            </span>
          )}
        </div>

        {/* Right: countdown */}
        <div className="animate-fade-up delay-200 text-center">
          <div className="flex items-center gap-1.5 justify-center text-emerald-200 mb-3">
            <Clock size={16} className="blink" />
            <span className="text-xs font-bold tracking-widest uppercase">{t('startsIn')}</span>
          </div>

          <div className="flex items-center gap-2">
            <TimeBlock value={pad(h)} label="HRS" />
            <span className="text-3xl font-black text-white blink">:</span>
            <TimeBlock value={pad(m)} label="MIN" />
            <span className="text-3xl font-black text-white blink">:</span>
            <TimeBlock value={pad(s)} label="SEC" />
          </div>
        </div>
      </div>

      {/* Bottom gold bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D4AF37, #F0CC5A, #D4AF37)' }} />
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl w-16 h-16 flex items-center justify-center">
        <span className="text-3xl font-black text-white tabular-nums tracking-tight">{value}</span>
      </div>
      <span className="text-emerald-300 text-[10px] font-bold mt-1 tracking-widest">{label}</span>
    </div>
  );
}
