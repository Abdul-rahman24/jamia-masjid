import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type {
  PrayerTime,
  JumuahInfo,
  Announcement,
  Janaazah,
  NikahInfo,
  Resource,
  RentalRequest,
  DonationInfo,
  ContactPerson,
  LocationInfo,
  MasjidInfo,
  JanaazahSubmission,
  NikahSubmission,
  RamadanSettings
} from '../types';

interface DataContextType {
  prayerTimes: PrayerTime[];
  jumuahInfo: JumuahInfo;
  announcements: Announcement[];
  janaazah: Janaazah[];
  nikahInfo: NikahInfo;
  resources: Resource[];
  rentalRequests: RentalRequest[];
  donationInfo: DonationInfo;
  contacts: ContactPerson[];
  locationInfo: LocationInfo;
  masjidInfo: MasjidInfo;
  janaazahSubmissions: JanaazahSubmission[];
  nikahSubmissions: NikahSubmission[];
  ramadanSettings: RamadanSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_RAMADAN: RamadanSettings = {
  year: '1448 AH',
  startDate: '2027-02-18',
  endDate: '2027-03-19',
  eidDate: '2027-03-20',
  timetable: [],
  taraweeh: { time: 'After Isha', rakaat: '20', imam: 'Hajrat', specialNights: [] },
  duas: [],
  reminders: [],
  importantNights: [],
  keyEvents: [],
  nisabGoldGrams: 85,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Omit<DataContextType, 'loading' | 'refresh'>>({
    prayerTimes: [],
    jumuahInfo: { sessions: [] },
    announcements: [],
    janaazah: [],
    nikahInfo: { requirements: [], procedure: '', contactPerson: '', contactPhone: '', introduction: '' },
    resources: [],
    rentalRequests: [],
    donationInfo: { instructions: '', contactPerson: '' },
    contacts: [],
    locationInfo: { name: '', address: '', landmark: '', mapsLink: '' },
    masjidInfo: { name: 'Masjid', establishedYear: '', history: '', mission: '', facilities: [] },
    janaazahSubmissions: [],
    nikahSubmissions: [],
    ramadanSettings: DEFAULT_RAMADAN,
  });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [
        prayerTimes,
        jumuahInfo,
        announcements,
        janaazah,
        nikahInfo,
        resources,
        rentalRequests,
        donationInfo,
        contacts,
        locationInfo,
        masjidInfo,
        janaazahSubmissions,
        nikahSubmissions,
        ramadanSettings
      ] = await Promise.all([
        api.getPrayerTimes(),
        api.getJumuahInfo(),
        api.getAnnouncements(),
        api.getJanaazah(),
        api.getNikahInfo(),
        api.getResources(),
        api.getRentalRequests(),
        api.getDonationInfo(),
        api.getContacts(),
        api.getLocationInfo(),
        api.getMasjidInfo(),
        api.getJanaazahSubmissions(),
        api.getNikahSubmissions(),
        api.getRamadanSettings()
      ]);

      setData({
        prayerTimes,
        jumuahInfo,
        announcements,
        janaazah,
        nikahInfo,
        resources,
        rentalRequests,
        donationInfo,
        contacts,
        locationInfo,
        masjidInfo,
        janaazahSubmissions,
        nikahSubmissions,
        ramadanSettings,
      });
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DataContext.Provider value={{ ...data, loading, refresh }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
