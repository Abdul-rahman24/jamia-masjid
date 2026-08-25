export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Sunset' | 'Maghrib' | 'Isha';

export interface PrayerTime {
  name: PrayerName;
  adhan: string;
  iqamah?: string; // Optional if not provided
}

export interface JumuahSession {
  id: string;
  khutbahTime: string;
  jamaahTime: string;
  khateeb?: string;
}

export interface JumuahInfo {
  sessions: JumuahSession[];
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: 'General' | 'Masjid' | 'Jumuah' | 'Janaazah' | 'Ramadan' | 'Important';
  priority: 'Normal' | 'Important' | 'Urgent';
  publishedDate: string; // ISO format
  expiryDate?: string; // ISO format
  active: boolean;
}

export interface Janaazah {
  id: string;
  name: string;
  date: string; // ISO format
  prayerTime: string;
  prayerLocation: string;
  burialLocation: string;
  additionalInfo?: string;
  publishedDate: string; // ISO format
  active: boolean;
}

export interface NikahInfo {
  introduction: string;
  requirements: string[];
  procedure: string;
  contactPerson: string;
  contactPhone: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  totalQuantity: number;
  price: number;
}

export type RentalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Returned' | 'Overdue';

export interface RentalRequest {
  id: string;
  items: { resourceId: string; quantity: number }[];
  customerName: string;
  phone: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  returnDate: string; // ISO date string
  purpose: string;
  notes?: string;
  status: RentalStatus;
  createdAt: string; // ISO string
  adminNotes?: string;
}

export interface DonationInfo {
  upiId?: string;
  qrCodeUrl?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  instructions: string;
  contactPerson: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp?: string;
  email?: string;
}

export interface LocationInfo {
  name: string;
  address: string;
  landmark: string;
  mapsLink: string;
}

export interface MasjidInfo {
  name: string;
  establishedYear: string;
  history: string;
  mission: string;
  imam?: string;
  facilities: string[];
}

export type SubmissionStatus = 'Pending' | 'Seen' | 'Done';

export interface JanaazahSubmission {
  id: string;
  submitterName: string;
  submitterPhone: string;
  fileName?: string;
  submittedAt: string;
  status: SubmissionStatus;
  adminNotes?: string;
}

export interface NikahSubmission {
  id: string;
  submitterName: string;
  submitterPhone: string;
  preferredDate: string;
  groomName: string;
  groomAddress: string;
  groomProof?: string;
  brideName: string;
  brideAddress: string;
  brideProof?: string;
  submittedAt: string;
  status: SubmissionStatus;
  adminNotes?: string;
}
