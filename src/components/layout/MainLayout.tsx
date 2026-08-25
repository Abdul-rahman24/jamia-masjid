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
    { key: 'home',        path: '/' },
    { key: 'prayerTimes', path: '/prayer-times' },
    { key: 'janaazah',   path: '/janaazah' },
    { key: 'nikah',      path: '/nikah' },
    { key: 'rentOut',    path: '/rent-out' },
    { key: 'ramadan',    path: '/ramadan' },
    { key: 'about',      path: '/about' },
  ];

  const isActive = (p: string) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p);

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-[var(--color-background)]">

      {/* ── Header ── */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow"
                   style={{ background: 'linear-gradient(135deg,#0D7A4E,#059669)' }}>ج</div>
              <div className="leading-tight">
                <span className="font-black text-lg text-[var(--color-primary)] block">{masjidInfo.name}</span>
                <span className="text-xs text-gray-500">Kattumavadi, TN</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive(l.path)
                      ? 'bg-emerald-50 text-[var(--color-primary)]'
                      : 'text-gray-600 hover:text-[var(--color-primary)] hover:bg-emerald-50'
                  }`}>{t(l.key)}</Link>
              ))}
            </nav>

            {/* Right: Language + Donate */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* Language switcher — clearly labelled */}
              <button onClick={toggle}
                className="flex items-center gap-2 border-2 border-emerald-300 rounded-full px-3 py-1.5 text-xs font-bold text-[var(--color-primary)] hover:bg-emerald-50 transition-colors">
                <Globe size={14} />
                <span className="text-gray-500">|</span>
                <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              <Link to="/donations"
                className="text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg,#0D7A4E,#10B981)' }}>
                💚 {t('donate')}
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={toggle}
                className="flex items-center gap-1 border border-emerald-300 rounded-full px-2.5 py-1.5 text-xs font-bold text-[var(--color-primary)]">
                <Globe size={12} /> {lang === 'en' ? 'த' : 'En'}
              </button>
              <Link to="/donations"
                className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-full text-xs font-bold">
                {t('donate')}
              </Link>
              <button onClick={() => setOpen(!open)} className="text-gray-600 p-1">
                {open ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t absolute w-full shadow-xl z-50 slide-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                    isActive(l.path)
                      ? 'bg-emerald-50 text-[var(--color-primary)]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]'
                  }`}>{t(l.key)}</Link>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 mt-3">
                <Link to="/location" className="flex items-center gap-2 text-gray-600 text-sm px-3 py-2 rounded-lg hover:bg-gray-50">
                  <MapPin size={16} /> {t('locTitle')}
                </Link>
                <Link to="/contact" className="flex items-center gap-2 text-gray-600 text-sm px-3 py-2 rounded-lg hover:bg-gray-50">
                  <Phone size={16} /> {t('conTitle')}
                </Link>
              </div>
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
              <p className="text-emerald-200 text-sm mb-4">Kattumavadi, Tamil Nadu — PIN 614630</p>
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
