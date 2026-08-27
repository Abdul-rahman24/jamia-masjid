import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Globe } from 'lucide-react';
import { useLang } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { masjidInfo, locationInfo, contacts } = useData();
  const { lang, toggle, t } = useLang();

  useEffect(() => setOpen(false), [location]);

  const navLinks = [
    { key: 'home',          path: '/' },
    { key: 'prayerTimes',   path: '/prayer-times' },
    { key: 'announcements', path: '/announcements' },
    { key: 'nikah',         path: '/nikah' },
    { key: 'janaazah',      path: '/janaazah' },
    { key: 'rentOut',       path: '/rent-out' },
    { key: 'about',         path: '/about' },
  ];

  const isActive = (p: string) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p);

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-[var(--color-background)] overflow-x-hidden">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50">
        {/* Top band: emerald accent line at very top */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

        {/* Main bar */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[76px]">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm flex-shrink-0"
                     style={{ background: 'linear-gradient(135deg,#065235,#0D7A4E)' }}>🕌</div>
                <div className="leading-none">
                  <span className="font-black text-base lg:text-lg text-[#065235] block">{masjidInfo.name}</span>
                  <span className="text-[10px] lg:text-xs text-emerald-600 font-semibold tracking-wide uppercase">Kattumavadi, TN</span>
                </div>
              </Link>

              {/* Desktop Nav — centered */}
              <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-6">
                {navLinks.map(l => (
                  <Link key={l.path} to={l.path}
                    className={`relative px-3 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
                      isActive(l.path)
                        ? 'text-[#065235] bg-emerald-50'
                        : 'text-gray-500 hover:text-[#065235] hover:bg-gray-50'
                    }`}>
                    {t(l.key)}
                    {isActive(l.path) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-600 rounded-full" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Right: Language + Donate (Desktop Only) */}
              <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                <button onClick={toggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <Globe size={13} />
                  <span className="text-gray-300">|</span>
                  <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
                </button>

                <Link to="/donations"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black text-white shadow transition-all hover:shadow-md hover:-translate-y-px"
                  style={{ background: 'linear-gradient(135deg,#065235,#0D9960)' }}>
                  💚 {t('donate')}
                </Link>
              </div>

              {/* Mobile: Hamburger only */}
              <button onClick={() => setOpen(!open)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[#065235] hover:bg-emerald-50 transition-colors">
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100 slide-in">
            {/* Quick actions row */}
            <div className="flex gap-2 px-4 pt-4 pb-3 border-b border-gray-100">
              <button onClick={toggle}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <Globe size={15} /> {lang === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <Link to="/donations"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow"
                style={{ background: 'linear-gradient(135deg,#065235,#0D9960)' }}>
                💚 {t('donate')}
              </Link>
            </div>

            {/* Nav links */}
            <div className="px-3 py-3 space-y-1">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path}
                  className={`flex items-center px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors ${
                    isActive(l.path)
                      ? 'bg-emerald-50 text-[#065235]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#065235]'
                  }`}>
                  {isActive(l.path) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2 flex-shrink-0" />}
                  {t(l.key)}
                </Link>
              ))}
            </div>

            {/* Bottom extras */}
            <div className="grid grid-cols-2 gap-2 px-3 pb-4 pt-2 border-t border-gray-100">
              <Link to="/location" className="flex items-center gap-2 text-gray-500 text-xs px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin size={14} className="text-emerald-600" /> {t('locTitle')}
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-gray-500 text-xs px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone size={14} className="text-emerald-600" /> {t('conTitle')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow"><Outlet /></main>

      {/* Footer */}
      <footer className="text-white pt-12 pb-8 mt-auto"
              style={{ background: 'linear-gradient(135deg,#065235,#0D7A4E)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-lg">ج</div>
                <span className="font-black text-xl">{masjidInfo.name}</span>
              </div>
              <p className="text-emerald-200 text-sm mb-4">{locationInfo.address}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-300 tracking-widest uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li><Link to="/prayer-times" className="hover:text-white">{t('prayerTimes')}</Link></li>
                <li><Link to="/janaazah" className="hover:text-white">{t('janaazah')}</Link></li>
                <li><Link to="/nikah" className="hover:text-white">{t('nikah')}</Link></li>
                <li><Link to="/ramadan" className="hover:text-white">{t('ramadan')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-300 tracking-widest uppercase mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li><Link to="/rent-out" className="hover:text-white">{t('rentOut')}</Link></li>
                <li><Link to="/donations" className="hover:text-white">{t('donate')}</Link></li>
                <li><Link to="/about" className="hover:text-white">{t('about')}</Link></li>
                <li><Link to="/contact" className="hover:text-white">{t('conTitle')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-300 tracking-widest uppercase mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-emerald-100">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 text-[var(--color-accent)] flex-shrink-0" />
                  <span>{locationInfo.address}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-[var(--color-accent)] flex-shrink-0" />
                  <span>{contacts[0]?.phone ?? '—'}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-800 mt-10 pt-6 text-center text-sm text-emerald-400">
            <p>
              &copy; {new Date().getFullYear()} {masjidInfo.name}. 
              <Link to="/admin" className="cursor-default ml-1 hover:text-emerald-300">All rights reserved.</Link>
            </p>
            <div className="mt-6 inline-block bg-emerald-900/50 border border-emerald-700/50 rounded-2xl px-6 py-3 shadow-lg">
              <p className="text-emerald-50 font-black text-lg md:text-xl tracking-wide drop-shadow-md uppercase">
                {t('createdBy')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
