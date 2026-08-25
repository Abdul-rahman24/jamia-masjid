import { describe, it, expect } from 'vitest';
import { getNextPrayer } from './prayerTimes';
import type { PrayerTime } from '../types';

describe('Prayer Times Logic', () => {
  const mockPrayers: PrayerTime[] = [
    { name: 'Fajr', adhan: '05:00' },
    { name: 'Dhuhr', adhan: '12:30' },
    { name: 'Asr', adhan: '15:45' },
    { name: 'Maghrib', adhan: '18:15' },
    { name: 'Isha', adhan: '19:45' },
  ];

  it('finds the next prayer on the same day', () => {
    // 10:00 AM, next is Dhuhr
    const now = new Date('2023-01-01T10:00:00');
    const result = getNextPrayer(mockPrayers, now);
    expect(result?.prayer.name).toBe('Dhuhr');
    expect(result?.isTomorrow).toBe(false);
  });

  it('finds Fajr as next prayer if before Fajr today', () => {
    // 04:00 AM, next is Fajr
    const now = new Date('2023-01-01T04:00:00');
    const result = getNextPrayer(mockPrayers, now);
    expect(result?.prayer.name).toBe('Fajr');
    expect(result?.isTomorrow).toBe(false);
  });

  it('finds Fajr tomorrow as next prayer if after Isha today', () => {
    // 21:00 PM (9 PM), next is tomorrow's Fajr
    const now = new Date('2023-01-01T21:00:00');
    const result = getNextPrayer(mockPrayers, now);
    expect(result?.prayer.name).toBe('Fajr');
    expect(result?.isTomorrow).toBe(true);
  });
});

