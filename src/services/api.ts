import { INITIAL_DATA } from './db';
import type { JanaazahSubmission, NikahSubmission } from '../types';

type CollectionName = keyof typeof INITIAL_DATA;

function get<T>(collection: CollectionName): T {
  const data = localStorage.getItem(`masjid_${collection}`);
  return data ? JSON.parse(data) : (INITIAL_DATA[collection] as unknown as T);
}

function set<T>(collection: CollectionName, data: T): void {
  localStorage.setItem(`masjid_${collection}`, JSON.stringify(data));
}

function getExtra<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function setExtra<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Specific API wrappers
export const api = {
  getPrayerTimes: () => get<typeof INITIAL_DATA.prayerTimes>('prayerTimes'),
  setPrayerTimes: (data: typeof INITIAL_DATA.prayerTimes) => set('prayerTimes', data),

  getJumuahInfo: () => get<typeof INITIAL_DATA.jumuahInfo>('jumuahInfo'),
  setJumuahInfo: (data: typeof INITIAL_DATA.jumuahInfo) => set('jumuahInfo', data),

  getAnnouncements: () => get<typeof INITIAL_DATA.announcements>('announcements'),
  setAnnouncements: (data: typeof INITIAL_DATA.announcements) => set('announcements', data),

  getJanaazah: () => get<typeof INITIAL_DATA.janaazah>('janaazah'),
  setJanaazah: (data: typeof INITIAL_DATA.janaazah) => set('janaazah', data),

  getNikahInfo: () => get<typeof INITIAL_DATA.nikahInfo>('nikahInfo'),
  setNikahInfo: (data: typeof INITIAL_DATA.nikahInfo) => set('nikahInfo', data),

  getResources: () => get<typeof INITIAL_DATA.resources>('resources'),
  setResources: (data: typeof INITIAL_DATA.resources) => set('resources', data),

  getRentalRequests: () => get<typeof INITIAL_DATA.rentalRequests>('rentalRequests'),
  setRentalRequests: (data: typeof INITIAL_DATA.rentalRequests) => set('rentalRequests', data),
  addRentalRequest: (req: import('../types').RentalRequest) => {
    const all = get<typeof INITIAL_DATA.rentalRequests>('rentalRequests');
    set('rentalRequests', [...all, req]);
  },

  getDonationInfo: () => get<typeof INITIAL_DATA.donationInfo>('donationInfo'),
  setDonationInfo: (data: typeof INITIAL_DATA.donationInfo) => set('donationInfo', data),

  getContacts: () => get<typeof INITIAL_DATA.contacts>('contacts'),
  setContacts: (data: typeof INITIAL_DATA.contacts) => set('contacts', data),

  getLocationInfo: () => get<typeof INITIAL_DATA.locationInfo>('locationInfo'),
  setLocationInfo: (data: typeof INITIAL_DATA.locationInfo) => set('locationInfo', data),

  getMasjidInfo: () => get<typeof INITIAL_DATA.masjidInfo>('masjidInfo'),
  setMasjidInfo: (data: typeof INITIAL_DATA.masjidInfo) => set('masjidInfo', data),

  // ── Submissions ────────────────────────────────────────────────
  getJanaazahSubmissions: (): JanaazahSubmission[] =>
    getExtra('masjid_janaazahSubmissions', []),
  addJanaazahSubmission: (s: JanaazahSubmission) => {
    const all = getExtra<JanaazahSubmission[]>('masjid_janaazahSubmissions', []);
    setExtra('masjid_janaazahSubmissions', [...all, s]);
  },
  updateJanaazahSubmission: (updated: JanaazahSubmission) => {
    const all = getExtra<JanaazahSubmission[]>('masjid_janaazahSubmissions', []);
    setExtra('masjid_janaazahSubmissions', all.map(s => s.id === updated.id ? updated : s));
  },

  getNikahSubmissions: (): NikahSubmission[] =>
    getExtra('masjid_nikahSubmissions', []),
  addNikahSubmission: (s: NikahSubmission) => {
    const all = getExtra<NikahSubmission[]>('masjid_nikahSubmissions', []);
    setExtra('masjid_nikahSubmissions', [...all, s]);
  },
  updateNikahSubmission: (updated: NikahSubmission) => {
    const all = getExtra<NikahSubmission[]>('masjid_nikahSubmissions', []);
    setExtra('masjid_nikahSubmissions', all.map(s => s.id === updated.id ? updated : s));
  },
};
