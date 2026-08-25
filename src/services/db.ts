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
  MasjidInfo
} from '../types';

export const INITIAL_DATA = {
  prayerTimes: [
    { name: 'Fajr', adhan: '05:00', iqamah: '05:30' },
    { name: 'Sunrise', adhan: '06:15' },
    { name: 'Dhuhr', adhan: '12:30', iqamah: '13:00' },
    { name: 'Asr', adhan: '15:45', iqamah: '16:00' },
    { name: 'Sunset', adhan: '18:15' },
    { name: 'Maghrib', adhan: '18:15', iqamah: '18:20' },
    { name: 'Isha', adhan: '19:45', iqamah: '20:00' },
  ] as PrayerTime[],
  
  jumuahInfo: {
    sessions: [
      { id: '1', khutbahTime: '12:45', jamaahTime: '13:15', khateeb: 'Hafiz Dr. Example' }
    ],
    notes: 'Please arrive early and park responsibly.'
  } as JumuahInfo,

  announcements: [] as Announcement[],
  janaazah: [] as Janaazah[],
  
  nikahInfo: {
    introduction: 'The Masjid provides Nikah services for the local community.',
    requirements: [
      'Both parties must be Muslim.',
      'Two Muslim witnesses.',
      'Government ID proof.',
      'Prior appointment (at least 1 week).'
    ],
    procedure: 'Please contact the secretary to book a date. Submit the required documents at least 3 days before the Nikah.',
    contactPerson: 'Secretary',
    contactPhone: '+91 90000 00003'
  } as NikahInfo,

  resources: [
    {
      id: 'res-1',
      name: 'Folding Chairs',
      description: 'Standard plastic folding chairs for events.',
      totalQuantity: 100,
      price: 5,
    },
    {
      id: 'res-2',
      name: 'Large Cooking Vessels (Daig)',
      description: 'Large vessels suitable for biryani.',
      totalQuantity: 5,
      price: 150,
    }
  ] as Resource[],

  rentalRequests: [] as RentalRequest[],

  donationInfo: {
    upiId: 'kattumavadimasjid@upi',
    bankName: 'Sample Bank',
    accountName: 'Jamia Masjid Kattumavadi',
    accountNumber: '123456789012',
    ifsc: 'SAMB0001234',
    instructions: 'Please verify the details before making a transfer. Add your name in the remarks.',
    contactPerson: 'Sample Treasurer'
  } as DonationInfo,

  contacts: [
    { id: '0', name: 'Hajrat', role: 'Imam / Hajrat', phone: '+91 90000 00000' },
    { id: '1', name: 'Thalaivar', role: 'Thalaivar (President)', phone: '+91 90000 00001', whatsapp: '+919000000001' },
    { id: '2', name: 'Thunai Thalaivar', role: 'Thunai Thalaivar (VP)', phone: '+91 90000 00002' },
    { id: '3', name: 'Secretary', role: 'Secretary', phone: '+91 90000 00003', whatsapp: '+919000000003' }
  ] as ContactPerson[],

  locationInfo: {
    name: 'Jamia Masjid Kattumavadi',
    address: 'Kattumavadi, Manamelkudi Taluk, Pudukkottai District, Tamil Nadu 614630',
    landmark: 'Kattumavadi',
    mapsLink: 'https://maps.app.goo.gl/FQATTMmRkvC16idD6'
  } as LocationInfo,

  masjidInfo: {
    name: 'Jamia Masjid Kattumavadi',
    establishedYear: 'Unknown',
    history: 'A central mosque serving the village community in Kattumavadi, providing a place for worship, learning, and gathering.',
    mission: 'To provide a welcoming environment for worship, learning, and community service.',
    imam: 'Hajrat',
    facilities: ['Wudu Area', 'Separate Sisters Section', 'Community Hall']
  } as MasjidInfo
};

const DB_VERSION = '3'; // Bump to version 3

export const initDB = () => {
  const storedVersion = localStorage.getItem('masjid_db_version');
  if (storedVersion !== DB_VERSION) {
    // Clear all masjid_ keys to reload fresh defaults
    Object.keys(localStorage)
      .filter(k => k.startsWith('masjid_'))
      .forEach(k => localStorage.removeItem(k));
    localStorage.setItem('masjid_db_version', DB_VERSION);
  }

  for (const [key, value] of Object.entries(INITIAL_DATA)) {
    if (!localStorage.getItem(`masjid_${key}`)) {
      localStorage.setItem(`masjid_${key}`, JSON.stringify(value));
    }
  }
};
