import { describe, it, expect } from 'vitest';
import { checkAvailability } from './rentals';
import type { RentalRequest } from '../types';

describe('Rental Availability Logic', () => {
  const mockRequests: RentalRequest[] = [
    {
      id: 'req-1',
      resourceId: 'chair-1',
      customerName: 'Test',
      phone: '123',
      quantity: 50,
      startDate: '2023-09-10',
      returnDate: '2023-09-12',
      purpose: 'Event',
      status: 'Approved',
      createdAt: new Date().toISOString()
    },
    {
      id: 'req-2',
      resourceId: 'chair-1',
      customerName: 'Test2',
      phone: '123',
      quantity: 30,
      startDate: '2023-09-12',
      returnDate: '2023-09-14',
      purpose: 'Event',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'req-3',
      resourceId: 'chair-1',
      customerName: 'Test3',
      phone: '123',
      quantity: 40,
      startDate: '2023-09-11',
      returnDate: '2023-09-11',
      purpose: 'Event',
      status: 'Rejected', // Should be ignored
      createdAt: new Date().toISOString()
    }
  ];

  it('calculates availability on a non-overlapping date', () => {
    // Sept 15: No active rentals. Total 100 available.
    const avail = checkAvailability('chair-1', 100, '2023-09-15', '2023-09-16', mockRequests);
    expect(avail).toBe(100);
  });

  it('calculates availability on overlapping dates correctly', () => {
    // Sept 11: req-1 has 50. Total 100. Should have 50 available.
    const avail = checkAvailability('chair-1', 100, '2023-09-11', '2023-09-11', mockRequests);
    expect(avail).toBe(50);
  });

  it('handles same-day overlap boundary correctly', () => {
    // Sept 12: req-1 has 50 returning, req-2 has 30 starting. Total used on Sept 12 = 80. Available = 20.
    const avail = checkAvailability('chair-1', 100, '2023-09-12', '2023-09-12', mockRequests);
    expect(avail).toBe(20);
  });

  it('calculates availability across a range taking the max used day', () => {
    // Sept 10 to Sept 14.
    // Sept 10: 50
    // Sept 11: 50
    // Sept 12: 50 + 30 = 80
    // Sept 13: 30
    // Sept 14: 30
    // Max used is 80. So available is 100 - 80 = 20.
    const avail = checkAvailability('chair-1', 100, '2023-09-10', '2023-09-14', mockRequests);
    expect(avail).toBe(20);
  });
});

