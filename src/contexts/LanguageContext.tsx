import React, { createContext, useContext, useState } from 'react';

type Lang = 'en' | 'ta';

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}

// ─── Comprehensive translations ──────────────────────────────────────────────
const T: Record<string, Record<Lang, string>> = {
  // Nav
  home:           { en: 'Home',           ta: 'முகப்பு' },
  prayerTimes:    { en: 'Prayer Times',   ta: 'தொழுகை நேரம்' },
  janaazah:       { en: 'Janaazah',       ta: 'ஜனாஸா' },
  nikah:          { en: 'Nikah',          ta: 'நிக்காஹ்' },
  rentOut:        { en: 'Rent Out',       ta: 'வாடகை' },
  about:          { en: 'About',          ta: 'பற்றி' },
  donate:         { en: 'Donate',         ta: 'நன்கொடை' },
  ramadan:        { en: 'Ramadan',        ta: 'ரமழான்' },
  langLabel:      { en: '🌐 Language / மொழி', ta: '🌐 Language / மொழி' },
  switchToTamil:  { en: 'தமிழ்',          ta: 'English' },

  // Prayer
  nextPrayer:     { en: 'Next Prayer',    ta: 'அடுத்த தொழுகை' },
  startsIn:       { en: 'Starts In',      ta: 'தொடங்குகிறது' },
  todayPrayers:   { en: "Today's Prayers", ta: 'இன்றைய தொழுகைகள்' },
  prayer:         { en: 'Prayer',         ta: 'தொழுகை' },
  adhan:          { en: 'Adhan',          ta: 'அஜான்' },
  jamaah:         { en: "Jama'ah",        ta: 'ஜமாஅத்' },
  tomorrow:       { en: 'Tomorrow',       ta: 'நாளை' },
  viewAll:        { en: 'View Prayer Times', ta: 'தொழுகை நேரங்கள் காண' },

  // Home
  getDirections:  { en: 'Get Directions', ta: 'வழி காண்க' },
  islamicDate:    { en: 'Islamic Date',   ta: 'இஸ்லாமிய தேதி' },
  upcomingEvents: { en: 'Upcoming Islamic Events', ta: 'வரவிருக்கும் இஸ்லாமிய நிகழ்வுகள்' },
  nikahServices:  { en: 'Nikah Services', ta: 'நிக்காஹ் சேவைகள்' },
  nikahDesc:      { en: 'Nikah services for our community.', ta: 'சமுதாயத்திற்கான நிக்காஹ் சேவைகள்.' },
  viewReq:        { en: 'View Details →', ta: 'விவரங்கள் காண →' },
  ramadanTitle:   { en: '🌙 Ramadan',     ta: '🌙 ரமழான்' },
  ramadanDesc:    { en: 'Special timings & events', ta: 'சிறப்பு நேரங்கள் & நிகழ்வுகள்' },

  // Prayer Times page
  ptTitle:        { en: 'Prayer Times',   ta: 'தொழுகை நேரம்' },
  ptSub:          { en: "Daily Jama'ah schedule", ta: 'தினசரி ஜமாஅத் அட்டவணை' },
  ptToday:        { en: "Today's Schedule", ta: 'இன்றைய அட்டவணை' },

  // Janaazah page
  janTitle:       { en: 'Janaazah',       ta: 'ஜனாஸா' },
  janVerse:       { en: "Inna lillahi wa inna ilayhi raji'un", ta: "இன்னா லில்லாஹி வ இன்னா இலைஹி ராஜிஊன்" },
  janVerseM:      { en: "(We belong to Allah and to Him we shall return)", ta: "(நாம் அல்லாஹ்வுக்கே சொந்தம், அவனிடமே திரும்புவோம்)" },
  janActiveTitle: { en: 'Active Announcements', ta: 'தற்போதைய அறிவிப்புகள்' },
  janHistTitle:   { en: 'Recent History', ta: 'சமீபத்திய வரலாறு' },
  janNone:        { en: 'No active Janaazah announcements.', ta: 'தற்போது ஜனாஸா அறிவிப்புகள் இல்லை.' },
  janSubmitBtn:   { en: 'Submit Janaazah Notice', ta: 'ஜனாஸா அறிவிப்பு சமர்ப்பிக்க' },
  janFormTitle:   { en: 'Janaazah Notice Form', ta: 'ஜனாஸா அறிவிப்பு படிவம்' },
  janFormSub:     { en: 'Please fill in your details below.', ta: 'கீழே உங்கள் விவரங்களை பூர்த்தி செய்யுங்கள்.' },
  submitterName:  { en: 'Your Name',      ta: 'உங்கள் பெயர்' },
  submitterPhone: { en: 'Your Phone',     ta: 'உங்கள் தொலைபேசி' },
  uploadNotice:   { en: 'Upload Janaazah Notice (optional)', ta: 'ஜனாஸா அறிவிப்பை பதிவேற்றவும் (விரும்பினால்)' },
  mgmtContact:    { en: 'Contact Management', ta: 'நிர்வாகத்தை தொடர்பு கொள்ளவும்' },
  submitBtn:      { en: 'Submit',         ta: 'சமர்ப்பி' },
  cancel:         { en: 'Cancel',         ta: 'ரத்து செய்' },
  successTitle:   { en: 'Submitted Successfully!', ta: 'வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!' },
  successJan:     { en: "We've received your Janaazah notice. Our management will contact you shortly.", ta: "ஜனாஸா அறிவிப்பு பெறப்பட்டது. நிர்வாகம் விரைவில் தொடர்பு கொள்ளும்." },
  done:           { en: 'Done',           ta: 'முடிந்தது' },

  // Nikah page
  nikTitle:       { en: 'Nikah Services', ta: 'நிக்காஹ் சேவைகள்' },
  nikSub:         { en: 'Submit your Nikah details and preferred date.', ta: 'உங்கள் நிக்காஹ் விவரங்களையும் தேதியையும் சமர்ப்பிக்கவும்.' },
  nikCalTitle:    { en: 'Select Nikah Date', ta: 'நிக்காஹ் தேதி தேர்வு' },
  nikCalNote:     { en: 'Fridays & booked dates are unavailable.', ta: 'வெள்ளிக்கிழமை & முன்பதிவு தேதிகள் கிடைக்காது.' },
  nikFormTitle:   { en: 'Nikah Booking Form', ta: 'நிக்காஹ் பதிவு படிவம்' },
  nikSelectedDate:{ en: 'Selected Date',  ta: 'தேர்ந்தெடுத்த தேதி' },
  nikGroomName:   { en: "Groom's Name",   ta: 'மணமகன் பெயர்' },
  nikGroomAddress:{ en: "Groom's Address",ta: 'மணமகன் முகவரி' },
  nikGroomProof:  { en: "Groom's ID Proof",ta: 'மணமகன் அடையாள சான்று' },
  nikBrideName:   { en: "Bride's Name",   ta: 'மணமகள் பெயர்' },
  nikBrideAddress:{ en: "Bride's Address",ta: 'மணமகள் முகவரி' },
  nikBrideProof:  { en: "Bride's ID Proof",ta: 'மணமகள் அடையாள சான்று' },
  nikWeWillCall:  { en: '✅ We will call you to confirm your booking.', ta: '✅ பதிவை உறுதி செய்ய நாங்கள் உங்களை அழைப்போம்.' },
  nikProceedBtn:  { en: 'Proceed to Book', ta: 'பதிவு செய்ய தொடரவும்' },
  nikSuccessMsg:  { en: "Your Nikah booking request has been submitted. We will call you to confirm.", ta: "நிக்காஹ் பதிவு கோரிக்கை சமர்ப்பிக்கப்பட்டது. நாங்கள் உங்களை அழைத்து உறுதி செய்வோம்." },

  // Rent Out
  rentTitle:      { en: 'Rent Out',       ta: 'வாடகை' },
  rentSub:        { en: 'Items available for community events.', ta: 'சமுதாய நிகழ்வுகளுக்கு கிடைக்கும் பொருட்கள்.' },
  rentReqBtn:     { en: 'Request Item',   ta: 'பொருள் கோரிக்கை' },
  rentSuccess:    { en: 'Request Submitted!', ta: 'கோரிக்கை சமர்ப்பிக்கப்பட்டது!' },
  rentSuccessMsg: { en: 'The committee will review and contact you.', ta: 'குழு மதிப்பாய்வு செய்து தொடர்பு கொள்ளும்.' },
  rentQuantity:   { en: 'Available Quantity', ta: 'கிடைக்கும் அளவு' },
  rentPrice:      { en: 'Price',          ta: 'விலை' },
  rentAskBtn:     { en: 'Ask for Rent',   ta: 'வாடகைக்கு கேட்க' },
  rentReqQty:     { en: 'Required Quantity', ta: 'தேவையான அளவு' },

  // Donations
  donTitle:       { en: 'Support the Masjid', ta: 'மஸ்ஜிதை ஆதரிக்கவும்' },
  donVerse:       { en: '"Those who spend their wealth in charity..."', ta: '"தனது செல்வத்தை தர்மம் செய்வோருக்கு..."' },
  donNotice:      { en: 'No payments processed directly through this site.', ta: 'இந்த இணையதளத்தின் மூலம் நேரடி கட்டணம் எடுக்கப்படுவதில்லை.' },
  donUPI:         { en: 'UPI Payment',    ta: 'UPI கட்டணம்' },
  donBank:        { en: 'Bank Transfer',  ta: 'வங்கி பரிமாற்றம்' },
  donAccName:     { en: 'Account Name',   ta: 'கணக்கு பெயர்' },
  donAccNum:      { en: 'Account Number', ta: 'கணக்கு எண்' },
  donBank2:       { en: 'Bank Name',      ta: 'வங்கி பெயர்' },
  donIFSC:        { en: 'IFSC Code',      ta: 'IFSC குறியீடு' },

  // Location / Contact
  locTitle:       { en: 'Location',       ta: 'இடம்' },
  locSub:         { en: 'Visit us',       ta: 'எங்களை சந்திக்கவும்' },
  locCopy:        { en: 'Copy Address',   ta: 'முகவரி நகல்' },
  locCopied:      { en: 'Copied!',        ta: 'நகல் எடுக்கப்பட்டது!' },
  conTitle:       { en: 'Contact Management', ta: 'நிர்வாக தொடர்பு' },
  conSub:         { en: 'Get in touch with the Masjid committee.', ta: 'மஸ்ஜித் குழுவை தொடர்பு கொள்ளுங்கள்.' },

  // About
  abtTitle:       { en: 'About',          ta: 'பற்றி' },
  abtMgmt:        { en: 'Masjid Management', ta: 'மஸ்ஜித் நிர்வாகம்' },
  abtFacilities:  { en: 'Facilities',     ta: 'வசதிகள்' },
  abtLocation:    { en: 'Location',       ta: 'இடம்' },
  abtHistory:     { en: 'History',        ta: 'வரலாறு' },

  // Ramadan page
  ramTitle:       { en: 'Ramadan',        ta: 'ரமழான்' },
  ramSub:         { en: 'The blessed month of fasting and worship.', ta: 'நோன்பு மற்றும் வழிபாட்டின் புனித மாதம்.' },
  ramDaysLeft:    { en: 'Days to Next Ramadan', ta: 'அடுத்த ரமழான் வர இன்னும்' },
  ramDates:       { en: 'Ramadan Key Dates', ta: 'ரமழான் முக்கிய தேதிகள்' },
  ramTimetable:   { en: 'Ramadan Timetable', ta: 'ரமழான் நேர அட்டவணை' },
  ramSehriEnd:    { en: 'Sehri/Suhoor End', ta: 'சஹர் முடிவு' },
  ramIftarMaghrib:{ en: 'Iftar/Maghrib',  ta: 'இஃப்தார்/மஃரிப்' },
  ramTaraweeh:    { en: 'Taraweeh',       ta: 'தராவீஹ்' },
  ramSuhoor:      { en: 'Suhoor (Sehri) ends at Fajr Adhan', ta: 'சுஹூர் ஃபஜ்ர் அஜானுடன் முடியும்' },
  ramIftar:       { en: 'Iftar at Maghrib Adhan', ta: 'இஃப்தார் மஃரிப் அஜானில்' },
  ramLaylat:      { en: "Laylat al-Qadr (Night of Power)", ta: 'லைலதுல் கத்ர் (பலியான இரவு)' },
  ramLaylat27:    { en: '27th Night of Ramadan', ta: 'ரமழானின் 27-ஆம் இரவு' },
  ramEid:         { en: 'Eid al-Fitr',    ta: 'ஈத் அல்-ஃபித்ர்' },
  ramZakat:       { en: 'Zakat al-Fitr',  ta: 'ஜகாத் அல்-ஃபித்ர்' },
  ramFasting:     { en: 'Fasting Period', ta: 'நோன்பு காலம்' },
  ramCountdown:   { en: 'Countdown',      ta: 'எண்ணி இறங்கு' },

  // Common
  date:           { en: 'Date',           ta: 'தேதி' },
  time:           { en: 'Time',           ta: 'நேரம்' },
  name:           { en: 'Name',           ta: 'பெயர்' },
  phone:          { en: 'Phone',          ta: 'தொலைபேசி' },
  noItems:        { en: 'No items available.', ta: 'பொருட்கள் இல்லை.' },
  clickUpload:    { en: 'Click to upload (PDF / JPG / PNG)', ta: 'பதிவேற்ற கிளிக் செய்யுங்கள் (PDF / JPG / PNG)' },
  required:       { en: 'required',       ta: 'கட்டாயம்' },
  whatsapp:       { en: 'WhatsApp',       ta: 'வாட்ஸ்அப்' },
  email:          { en: 'Email',          ta: 'மின்னஞ்சல்' },
  createdBy:      { en: 'Created by Abdul rahman S/O shahul hameed', ta: 'உருவாக்கியவர்: அப்துல் ரஹ்மான் S/O ஷாஹுல் ஹமீது' },
};

const LangCtx = createContext<LangContextValue>({
  lang: 'en', toggle: () => {}, t: k => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = () => setLang(l => l === 'en' ? 'ta' : 'en');
  const t = (key: string): string => T[key]?.[lang] ?? key;
  return <LangCtx.Provider value={{ lang, toggle, t }}>{children}</LangCtx.Provider>;
}

export function useLang() { return useContext(LangCtx); }
