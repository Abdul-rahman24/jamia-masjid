import { useEffect } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { MapPin, ExternalLink, Info, Phone } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

export default function About() {
  const { t } = useLang();
  const info     = api.getMasjidInfo();
  const contacts = api.getContacts();
  const loc      = api.getLocationInfo();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#location') {
      setTimeout(() => {
        document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #054030 0%, #0D7A4E 45%, #065235 100%)', minHeight: 300 }}>
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo-about" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-about)"/>
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-6 shadow-xl animate-fade-up">
            <Info size={40} className="text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md animate-fade-up delay-100">{info.name}</h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl mx-auto animate-fade-up delay-200">
            {info.history}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#ffffff"/></svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Management (Minimal Style without buttons) */}
        <section>
          <div className="text-center mb-10 animate-fade-up">
            <h2 className="text-3xl font-black text-gray-900">{t('abtMgmt')}</h2>
            <p className="text-gray-500 mt-2">Dedicated committee serving the community.</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-fade-up delay-100 divide-y divide-gray-100">
            {contacts.map((c) => (
              <div key={c.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{c.name}</h3>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{c.role}</p>
                  </div>
                </div>
                
                {/* Phone Number Display (No Button) */}
                <div className="flex items-center gap-3 sm:text-right bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 self-start sm:self-auto">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Contact</p>
                    <p className="font-black text-gray-900 leading-none">{c.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="animate-fade-up delay-200 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3">
              <MapPin className="text-blue-500" /> {t('abtLocation')}
            </h2>
          </div>

          <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-gray-100 rounded-3xl">
            <CardContent className="p-0">
              <div className="h-64 sm:h-80 w-full relative overflow-hidden group">
                <img src="/map.png" alt="Map Location" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <h3 className="font-black text-2xl mb-1 drop-shadow-md">{loc.name}</h3>
                  <p className="text-gray-200 drop-shadow-md mb-4">{loc.address}</p>
                  
                  <a href={loc.mapsLink} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors shadow-lg active:scale-95">
                    <ExternalLink size={16} /> Open in Google Maps
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
