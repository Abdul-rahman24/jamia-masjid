import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';

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

import Announcements from './pages/Announcements';
import Ramadan from './pages/Ramadan';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManagePrayers from './pages/admin/ManagePrayers';
import ManageSubmissions from './pages/admin/ManageSubmissions';
import ManageSettings from './pages/admin/ManageSettings';
import ManageRamadan from './pages/admin/ManageRamadan';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageEvents from './pages/admin/ManageEvents';

function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="announcements" element={<Announcements />} />
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
              <Route path="announcements" element={<ManageAnnouncements />} />
              <Route path="prayers" element={<ManagePrayers />} />
              <Route path="submissions" element={<ManageSubmissions />} />
              <Route path="settings" element={<ManageSettings />} />
              <Route path="ramadan" element={<ManageRamadan />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </LanguageProvider>
  );
}

export default App;
