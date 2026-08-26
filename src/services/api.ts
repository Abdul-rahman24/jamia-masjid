import { supabase } from './supabase';
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

export const api = {
  // Prayer Times
  getPrayerTimes: async (): Promise<PrayerTime[]> => {
    const { data, error } = await supabase.from('prayer_times').select('*');
    if (error) console.error(error);
    return data || [];
  },
  setPrayerTimes: async (prayers: PrayerTime[]) => {
    // Basic implementation for bulk upsert
    for (const p of prayers) {
      await supabase.from('prayer_times').upsert({ name: p.name, adhan: p.adhan, iqamah: p.iqamah });
    }
  },

  // Settings / Config Data
  getSetting: async <T>(key: string, fallback: T): Promise<T> => {
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).single();
    if (error) return fallback;
    return data?.value as T;
  },
  setSetting: async <T>(key: string, value: T) => {
    await supabase.from('site_settings').upsert({ key, value });
  },

  // Wrappers for specific settings
  getJumuahInfo: async (): Promise<JumuahInfo> => api.getSetting('jumuahInfo', { sessions: [] }),
  setJumuahInfo: async (data: JumuahInfo) => api.setSetting('jumuahInfo', data),

  getNikahInfo: async (): Promise<NikahInfo> => api.getSetting('nikahInfo', { requirements: [], procedure: '', contactPerson: '', contactPhone: '', introduction: '' }),
  setNikahInfo: async (data: NikahInfo) => api.setSetting('nikahInfo', data),

  getDonationInfo: async (): Promise<DonationInfo> => api.getSetting('donationInfo', { instructions: '', contactPerson: '' }),
  setDonationInfo: async (data: DonationInfo) => api.setSetting('donationInfo', data),

  getContacts: async (): Promise<ContactPerson[]> => api.getSetting('contacts', []),
  setContacts: async (data: ContactPerson[]) => api.setSetting('contacts', data),

  getLocationInfo: async (): Promise<LocationInfo> => api.getSetting('locationInfo', { name: '', address: '', landmark: '', mapsLink: '' }),
  setLocationInfo: async (data: LocationInfo) => api.setSetting('locationInfo', data),

  getMasjidInfo: async (): Promise<MasjidInfo> => api.getSetting('masjidInfo', { name: 'Masjid', establishedYear: '', history: '', mission: '', facilities: [] }),
  setMasjidInfo: async (data: MasjidInfo) => api.setSetting('masjidInfo', data),

  getRamadanSettings: async (): Promise<RamadanSettings> => api.getSetting('ramadanSettings', {
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
  }),
  setRamadanSettings: async (data: RamadanSettings) => api.setSetting('ramadanSettings', data),

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    const { data, error } = await supabase.from('announcements').select('*').order('published_date', { ascending: false });
    if (error) console.error(error);
    return (data || []).map(d => ({
      ...d,
      publishedDate: d.published_date,
      expiryDate: d.expiry_date
    })) as Announcement[];
  },
  addAnnouncement: async (data: Partial<Announcement>) => {
    await supabase.from('announcements').insert({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      active: data.active
    });
  },
  updateAnnouncement: async (data: Announcement) => {
    await supabase.from('announcements').update({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      active: data.active,
      expiry_date: data.expiryDate
    }).eq('id', data.id);
  },

  // Janaazah Notices
  getJanaazah: async (): Promise<Janaazah[]> => {
    const { data, error } = await supabase.from('janaazah').select('*').order('published_date', { ascending: false });
    if (error) console.error(error);
    return (data || []).map(d => ({
      ...d,
      prayerTime: d.prayer_time,
      prayerLocation: d.prayer_location,
      burialLocation: d.burial_location,
      additionalInfo: d.additional_info,
      publishedDate: d.published_date
    })) as Janaazah[];
  },
  addJanaazahNotice: async (data: Partial<Janaazah>) => {
    await supabase.from('janaazah').insert({
      name: data.name,
      date: data.date,
      prayer_time: data.prayerTime,
      prayer_location: data.prayerLocation,
      burial_location: data.burialLocation,
      additional_info: data.additionalInfo,
      active: data.active
    });
  },
  updateJanaazahNotice: async (data: Janaazah) => {
    await supabase.from('janaazah').update({
      name: data.name,
      date: data.date,
      prayer_time: data.prayerTime,
      prayer_location: data.prayerLocation,
      burial_location: data.burialLocation,
      additional_info: data.additionalInfo,
      active: data.active
    }).eq('id', data.id);
  },

  // Resources
  getResources: async (): Promise<Resource[]> => {
    const { data, error } = await supabase.from('resources').select('*');
    if (error) console.error(error);
    return (data || []).map(d => ({
      ...d,
      totalQuantity: d.total_quantity
    })) as Resource[];
  },
  addResource: async (data: Partial<Resource>) => {
    await supabase.from('resources').insert({
      name: data.name,
      description: data.description,
      total_quantity: data.totalQuantity,
      price: data.price
    });
  },
  updateResource: async (data: Resource) => {
    await supabase.from('resources').update({
      name: data.name,
      description: data.description,
      total_quantity: data.totalQuantity,
      price: data.price
    }).eq('id', data.id);
  },

  // Submissions: Rental Requests
  getRentalRequests: async (): Promise<RentalRequest[]> => {
    // Fetch requests and their associated items
    const { data, error } = await supabase.from('rental_requests')
      .select('*, items:rental_items(resource_id, quantity)')
      .order('created_at', { ascending: false });
      
    if (error) console.error(error);
    return (data || []).map(d => ({
      ...d,
      customerName: d.customer_name,
      startDate: d.start_date,
      returnDate: d.return_date,
      createdAt: d.created_at,
      adminNotes: d.admin_notes,
      items: d.items.map((i: any) => ({ resourceId: i.resource_id, quantity: i.quantity }))
    })) as RentalRequest[];
  },
  addRentalRequest: async (req: Omit<RentalRequest, 'id' | 'createdAt' | 'status'> & { id?: string, status: string, createdAt: string }) => {
    // Insert request
    const { data, error } = await supabase.from('rental_requests').insert({
      customer_name: req.customerName,
      phone: req.phone,
      start_date: req.startDate,
      return_date: req.returnDate,
      purpose: req.purpose,
      notes: req.notes,
      status: req.status
    }).select('id').single();
    
    if (error || !data) {
      console.error(error);
      return;
    }
    
    // Insert items
    if (req.items && req.items.length > 0) {
      const itemsToInsert = req.items.map(item => ({
        rental_request_id: data.id,
        resource_id: item.resourceId,
        quantity: item.quantity
      }));
      await supabase.from('rental_items').insert(itemsToInsert);
    }
  },
  updateRentalRequest: async (updated: RentalRequest) => {
    await supabase.from('rental_requests').update({
      status: updated.status,
      admin_notes: updated.adminNotes
    }).eq('id', updated.id);
  },

  // Submissions: Janaazah
  getJanaazahSubmissions: async (): Promise<JanaazahSubmission[]> => {
    const { data, error } = await supabase.from('janaazah_submissions').select('*').order('submitted_at', { ascending: false });
    if (error) console.error(error);
    return (data || []).map(d => ({
      ...d,
      submitterName: d.submitter_name,
      submitterPhone: d.submitter_phone,
      fileName: d.file_name,
      submittedAt: d.submitted_at,
      adminNotes: d.admin_notes
    })) as JanaazahSubmission[];
  },
  addJanaazahSubmission: async (s: Omit<JanaazahSubmission, 'id'>) => {
    await supabase.from('janaazah_submissions').insert({
      submitter_name: s.submitterName,
      submitter_phone: s.submitterPhone,
      file_name: s.fileName,
      status: s.status,
      admin_notes: s.adminNotes
    });
  },
  updateJanaazahSubmission: async (updated: JanaazahSubmission) => {
    await supabase.from('janaazah_submissions').update({
      status: updated.status,
      admin_notes: updated.adminNotes
    }).eq('id', updated.id);
  },

  // Submissions: Nikah
  getNikahSubmissions: async (): Promise<NikahSubmission[]> => {
    const { data, error } = await supabase.from('nikah_submissions').select('*').order('submitted_at', { ascending: false });
    if (error) console.error(error);
    return (data || []).map(d => ({
      ...d,
      submitterName: d.submitter_name,
      submitterPhone: d.submitter_phone,
      preferredDate: d.preferred_date,
      groomName: d.groom_name,
      groomAddress: d.groom_address,
      groomProof: d.groom_proof,
      brideName: d.bride_name,
      brideAddress: d.bride_address,
      brideProof: d.bride_proof,
      submittedAt: d.submitted_at,
      adminNotes: d.admin_notes
    })) as NikahSubmission[];
  },
  addNikahSubmission: async (s: Omit<NikahSubmission, 'id'>) => {
    await supabase.from('nikah_submissions').insert({
      submitter_name: s.submitterName,
      submitter_phone: s.submitterPhone,
      preferred_date: s.preferredDate,
      groom_name: s.groomName,
      groom_address: s.groomAddress,
      groom_proof: s.groomProof,
      bride_name: s.brideName,
      bride_address: s.brideAddress,
      bride_proof: s.brideProof,
      status: s.status,
      admin_notes: s.adminNotes
    });
  },
  updateNikahSubmission: async (updated: NikahSubmission) => {
    await supabase.from('nikah_submissions').update({
      status: updated.status,
      admin_notes: updated.adminNotes
    }).eq('id', updated.id);
  }
};
