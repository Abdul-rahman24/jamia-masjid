import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initDB } from './services/db';
import { LanguageProvider } from './contexts/LanguageContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import PrayerTimes from './pages/PrayerTimes';
import Janaazah from './pages/Janaazah';
import Nikah from './pages/Nikah';
import Resources from './pages/Resources';
import Donations from './pages/Donations';
import Location from './pages/Location';
import Contact from './pages/Contact';
import About from './pages/About';

import Ramadan from './pages/Ramadan';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManagePrayers from './pages/admin/ManagePrayers';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageJanaazah from './pages/admin/ManageJanaazah';
import ManageResources from './pages/admin/ManageResources';
import ManageRentals from './pages/admin/ManageRentals';
import ManageSubmissions from './pages/admin/ManageSubmissions';

function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="prayer-times" element={<PrayerTimes />} />
            <Route path="janaazah" element={<Janaazah />} />
            <Route path="nikah" element={<Nikah />} />
            <Route path="rent-out" element={<Resources />} />
            <Route path="donations" element={<Donations />} />
            <Route path="location" element={<Location />} />
            <Route path="contact" element={<Contact />} />
            <Route path="ramadan" element={<Ramadan />} />
            <Route path="about" element={<About />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="prayers" element={<ManagePrayers />} />
            <Route path="announcements" element={<ManageAnnouncements />} />
            <Route path="janaazah" element={<ManageJanaazah />} />
            <Route path="resources" element={<ManageResources />} />
            <Route path="rentals" element={<ManageRentals />} />
            <Route path="submissions" element={<ManageSubmissions />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
