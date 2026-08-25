import { Link } from 'react-router-dom';
import { MapPin, Heart, CalendarDays, Star, Users, Clock, Sunrise, Sunset, Moon } from 'lucide-react';
import NextPrayerCard from '../components/features/NextPrayerCard';
import AnnouncementBanner from '../components/features/AnnouncementBanner';
import { Card, CardContent } from '../components/ui/Card';
import { api } from '../services/api';
import { formatTime } from '../utils/prayerTimes';
import { toHijri, getUpcomingEvents } from '../utils/hijriDate';
import { useLang } from '../contexts/LanguageContext';
import { format } from 'date-fns';

export default function Home() {
  const { t } = useLang();
  const masjidInfo = api.getMasjidInfo();
  const prayerTimes = api.getPrayerTimes();
  const jumuahInfo = api.getJumuahInfo();
  const janaazah = api.getJanaazah().filter(j => j.active);
  const hijri = toHijri();
  const events = getUpcomingEvents(5);

  const mainPrayers = prayerTimes.filter(p => p.name !== 'Sunrise' && p.name !== 'Sunset');
  const sunrise = prayerTimes.find(p => p.name === 'Sunrise');
  const sunset = prayerTimes.find(p => p.name === 'Sunset');

  return (
    <div>
      <AnnouncementBanner />

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #054030 0%, #0D7A4E 45%, #065235 100%)', minHeight: 420 }}>
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,5 55,17 55,43 30,55 5,43 5,17" fill="none" stroke="white" strokeWidth="0.8"/>
              <polygon points="30,15 45,22 45,38 30,45 15,38 15,22" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)"/>
        </svg>

        <div className="h-1 w-full absolute top-0" style={{ background: 'linear-gradient(90deg, #D4AF37, #F0CC5A, #D4AF37)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="animate-fade-up text-center md:text-left max-w-xl">
            <div className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-emerald-200 text-sm font-semibold mb-5">
              🕌 Kattumavadi, Tamil Nadu
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
              {masjidInfo.name}
            </h1>
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              {masjidInfo.mission}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/prayer-times"
                className="bg-white text-[var(--color-primary)] px-7 py-3.5 rounded-full font-black shadow-xl hover:shadow-white/30 hover:scale-105 transition-all text-sm">
                🕐 {t('prayerTimes')}
              </Link>
              <Link to="/about#location"
                className="border-2 border-white text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2">
                <MapPin size={18} /> {t('getDirections')}
              </Link>
            </div>
          </div>

          <div className="animate-fade-up delay-200 animate-float flex-shrink-0">
            <div className="w-52 h-52 rounded-full border-4 border-white/30 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm"
                 style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)' }}>
              <div className="text-[var(--color-accent)] text-3xl font-black">{hijri.day}</div>
              <div className="text-white text-sm font-bold leading-tight px-4">{hijri.monthName}</div>
              <div className="text-emerald-200 text-xs">{hijri.year} AH</div>
              <div className="w-10 h-px bg-white/30 my-2" />
              <div className="text-emerald-100 text-xs">{format(new Date(), 'MMM d, yyyy')}</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#F0FDF7"/></svg>
        </div>
      </section>

      {/* ── Services Highlights ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/rent-out" className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col items-center text-center group animate-fade-up">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><CalendarDays size={22}/></div>
            <h3 className="font-black text-gray-900 text-sm">{t('rentOut')}</h3>
          </Link>
          <Link to="/donations" className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col items-center text-center group animate-fade-up delay-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Heart size={22}/></div>
            <h3 className="font-black text-gray-900 text-sm">{t('donTitle')}</h3>
          </Link>
          <Link to="/nikah" className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col items-center text-center group animate-fade-up delay-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Users size={22}/></div>
            <h3 className="font-black text-gray-900 text-sm">{t('nikTitle')}</h3>
          </Link>
          <Link to="/ramadan" className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex flex-col items-center text-center group animate-fade-up delay-300">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Moon size={22}/></div>
            <h3 className="font-black text-gray-900 text-sm">{t('ramTitle')}</h3>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (Prayers) */}
          <div className="lg:col-span-2 space-y-8 animate-fade-up">
            <NextPrayerCard />
            
            <Card className="overflow-hidden shadow-xl border-0 ring-1 ring-gray-100 rounded-3xl">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Clock size={22} className="text-[var(--color-primary)]" />
                  {t('prayerTimes')}
                </h3>
                <span className="text-xs font-bold text-[var(--color-primary)] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              
              <CardContent className="p-0 bg-white flex flex-col">
                
                {/* Sunrise / Sunset Separated Row */}
                <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 bg-orange-50/20">
                  <div className="p-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 hover:bg-orange-50/50 transition-colors">
                    <div className="flex items-center gap-1.5 text-orange-500 font-bold text-xs uppercase tracking-wider">
                      <Sunrise size={16} /> Sunrise
                    </div>
                    <span className="text-lg font-black text-gray-900">{sunrise ? formatTime(sunrise.adhan) : '—'}</span>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 hover:bg-orange-50/50 transition-colors">
                    <div className="flex items-center gap-1.5 text-orange-500 font-bold text-xs uppercase tracking-wider">
                      <Sunset size={16} /> Sunset
                    </div>
                    <span className="text-lg font-black text-gray-900">{sunset ? formatTime(sunset.adhan) : '—'}</span>
                  </div>
                </div>

                {/* 5 Prayers Detailed Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400">
                        <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-widest">{t('prayer')}</th>
                        <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-widest">{t('adhan')}</th>
                        <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-widest text-right">{t('jamaah')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {mainPrayers.map((p) => (
                        <tr key={p.name} className="hover:bg-emerald-50/40 transition-colors group">
                          <td className="py-4 px-6 font-black text-gray-900 text-base group-hover:text-[var(--color-primary)] transition-colors">
                            {p.name}
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-500 text-sm">{formatTime(p.adhan)}</td>
                          <td className="py-4 px-6 text-right font-black text-lg text-[var(--color-primary)]">
                            {p.iqamah ? formatTime(p.iqamah) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Smaller, Perfect Jumu'ah Section Integrated below the table */}
                <div className="bg-[var(--color-primary-dark)] text-white p-5 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2.5 rounded-xl shadow-inner border border-white/5"><Star size={24} className="text-amber-300"/></div>
                    <div>
                      <h4 className="font-black text-lg leading-none mb-1">Jumu'ah Mubarak</h4>
                      <p className="text-emerald-200 text-xs font-medium">Friday Congregational Prayer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5 sm:gap-8 bg-black/20 px-5 py-2.5 rounded-xl border border-white/10 shadow-inner">
                    <div className="text-center">
                      <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-0.5">Khutbah</p>
                      <p className="font-black text-xl leading-none">{formatTime(jumuahInfo.sessions[0].khutbahTime)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-0.5">Jama'ah</p>
                      <p className="font-black text-xl text-emerald-100 leading-none">{formatTime(jumuahInfo.sessions[0].jamaahTime)}</p>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Column (Events & Announcements) */}
          <div className="space-y-8 animate-fade-up delay-200">
            <Card className="overflow-hidden shadow-sm border-0 ring-1 ring-gray-100 rounded-3xl">
              <div className="px-5 py-4 bg-gray-900 text-white flex items-center gap-2">
                <CalendarDays size={18} className="text-amber-300" />
                <h3 className="font-black text-sm uppercase tracking-wide">Islamic Events</h3>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {events.map((ev, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${ev.color}`} />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{ev.name}</p>
                        <p className="text-xs text-[var(--color-primary)] font-semibold mb-1">{format(ev.gregorianDate, 'MMMM d, yyyy')}</p>
                        <p className="text-xs text-gray-500 leading-snug">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {janaazah.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Janaazah Alerts
                </h3>
                {janaazah.map(j => (
                  <Card key={j.id} className="border-l-4 border-l-gray-900 bg-gray-50 rounded-2xl">
                    <CardContent className="p-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Inna lillahi wa inna ilayhi raji'un</p>
                      <h4 className="font-black text-gray-900 text-base mb-2">{j.name}</h4>
                      <div className="text-sm text-gray-700">
                        <p><strong>Date:</strong> {format(new Date(j.date), 'MMM d, yyyy')}</p>
                        <p><strong>Prayer:</strong> {formatTime(j.prayerTime)} at {j.prayerLocation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Masjid Glimpses</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden shadow-lg h-64 sm:h-80 group">
            <img 
              src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnjC_8tAszrA1dJss9FngGScnS23q7mCJW20V0gT2o5hJis1pLjOkzCEDPxf1e-DVtSvb--Whz4OY1E4EgyDF8JcB-9T7vATPFMPcxG2nL6smmTVCpjDP6LjEmBwiCxYJdhvcnqtredXEHt=w1200-h800-k-no" 
              alt="Masjid view 1" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg h-64 sm:h-80 group">
            <img 
              src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmMwXZ0FXH8lEsxut-Lr5IRx34pwvjZAJSo2w3HPChZWRXWTYknPMqaPqlHTuwTIS4NDyIma_-T_vGzyFhVDA5YP0fBfRglRmIW7_NRp-Dr2Vlb5KI6_znzyFftsVSdvChSbqtT_kVVPDU=w1200-h800-k-no" 
              alt="Masjid view 2" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
