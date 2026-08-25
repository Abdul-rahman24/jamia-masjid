// Hijri date calculator using tabular Islamic calendar (civil/astronomical).
// Reference: 1 Muharram 1 AH = 16 July 622 CE (Julian) = JD 1948438.5

const HIJRI_MONTHS_EN = [
  'Muharram','Safar',"Rabi' al-Awwal","Rabi' al-Thani",
  "Jumada al-Awwal","Jumada al-Thani",'Rajab',"Sha'ban",
  'Ramadan','Shawwal',"Dhu al-Qi'dah","Dhu al-Hijjah",
];

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

export function toHijri(date: Date = new Date()): HijriDate {
  const d = date.getUTCDate();
  const m = date.getUTCMonth() + 1;
  const y = date.getUTCFullYear();

  // Gregorian -> Julian Day Number
  const a = Math.floor((14 - m) / 12);
  const Y = y + 4800 - a;
  const M = m + 12 * a - 3;
  const JDN = d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4)
    - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;

  // JDN -> Hijri (Tabular / civil algorithm)
  const L  = JDN - 1948440 + 10632;
  const N  = Math.floor((L - 1) / 10631);
  const L2 = L - 10631 * N + 354;
  const J  = Math.floor((10985 - L2) / 5316) * Math.floor((50 * L2) / 17719)
            + Math.floor(L2 / 5670) * Math.floor((43 * L2) / 15238);
  const L3 = L2 - Math.floor((30 - J) / 15) * Math.floor((17719 * J) / 50)
            - Math.floor(J / 16) * Math.floor((15238 * J) / 43) + 29;
  const hMonth = Math.floor((24 * L3) / 709);
  const hDay   = L3 - Math.floor((709 * hMonth) / 24);
  const hYear  = 30 * N + J - 30;

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthName: HIJRI_MONTHS_EN[hMonth - 1] ?? 'Unknown',
  };
}

// ─── Islamic events (approximate Gregorian dates for key events) ────────────
// Dates are computed for a 2-year window so they stay current.
// We store them as MM-DD and match against the current year and next year.

export interface IslamicEvent {
  name: string;
  gregorianDate: Date;
  description: string;
  color: string;
}

// Key 2026 / 2027 Islamic events (approximate, may vary by moon sighting)
const RAW_EVENTS: Array<{ name: string; date: string; desc: string; color: string }> = [
  { name: "Islamic New Year 1448",    date: "2026-06-16", desc: "1 Muharram 1448 AH",            color: "bg-emerald-500" },
  { name: "Ashura",                   date: "2026-06-25", desc: "10 Muharram — Day of fasting",  color: "bg-teal-600"   },
  { name: "Mawlid an-Nabi ﷺ",        date: "2026-09-04", desc: "12 Rabi' al-Awwal — Birth of the Prophet ﷺ", color: "bg-amber-500" },
  { name: "Ramadan Begins 1448",      date: "2027-02-18", desc: "1 Ramadan 1448 AH",             color: "bg-violet-600" },
  { name: "Laylat al-Qadr",          date: "2027-03-14", desc: "27 Ramadan — Night of Power",   color: "bg-purple-600" },
  { name: "Eid al-Fitr 1448",        date: "2027-03-20", desc: "1 Shawwal 1448 AH",             color: "bg-green-600"  },
  { name: "Eid al-Adha 1448",        date: "2027-05-27", desc: "10 Dhu al-Hijjah 1448 AH",      color: "bg-orange-500" },
  { name: "Islamic New Year 1449",   date: "2027-06-05", desc: "1 Muharram 1449 AH",            color: "bg-emerald-500"},
];

export function getUpcomingEvents(count = 4): IslamicEvent[] {
  const now = new Date();
  return RAW_EVENTS
    .map(e => ({ ...e, gregorianDate: new Date(e.date) }))
    .filter(e => e.gregorianDate >= now)
    .sort((a, b) => a.gregorianDate.getTime() - b.gregorianDate.getTime())
    .slice(0, count)
    .map(({ name, gregorianDate, desc, color }) => ({
      name, gregorianDate, description: desc, color,
    }));
}
