import { parse, isAfter, addDays, format, differenceInSeconds } from 'date-fns';
import type { PrayerTime } from '../types';

export interface NextPrayerResult {
  prayer: PrayerTime;
  time: Date;
  isTomorrow: boolean;
  secondsRemaining: number;
}

export function getNextPrayer(prayers: PrayerTime[], now: Date = new Date()): NextPrayerResult | null {
  if (!prayers || prayers.length === 0) return null;

  // Ordered strictly from Fajr to Isha
  const orderedNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const orderedPrayers = orderedNames.map(name => prayers.find(p => p.name === name)).filter(Boolean) as PrayerTime[];

  if (orderedPrayers.length === 0) return null;

  const todayStr = format(now, 'yyyy-MM-dd');
  
  for (const prayer of orderedPrayers) {
    const prayerTimeToday = parse(`${todayStr} ${prayer.adhan}`, 'yyyy-MM-dd HH:mm', now);
    if (isAfter(prayerTimeToday, now)) {
      return {
        prayer,
        time: prayerTimeToday,
        isTomorrow: false,
        secondsRemaining: differenceInSeconds(prayerTimeToday, now)
      };
    }
  }

  // If all prayers today have passed, the next is tomorrow's Fajr
  const firstPrayer = orderedPrayers[0];
  const tomorrow = addDays(now, 1);
  const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
  const prayerTimeTomorrow = parse(`${tomorrowStr} ${firstPrayer.adhan}`, 'yyyy-MM-dd HH:mm', now);

  return {
    prayer: firstPrayer,
    time: prayerTimeTomorrow,
    isTomorrow: true,
    secondsRemaining: differenceInSeconds(prayerTimeTomorrow, now)
  };
}

export function formatTime(timeStr: string) {
  // Convert 24h to 12h with AM/PM for display
  try {
    const parsed = parse(timeStr, 'HH:mm', new Date());
    return format(parsed, 'h:mm a');
  } catch (e) {
    return timeStr;
  }
}

