import type { RentalRequest } from '../types';
import { startOfDay } from 'date-fns';

export function checkAvailability(
  resourceId: string,
  totalQuantity: number,
  requestedStartDate: string, // YYYY-MM-DD
  requestedReturnDate: string, // YYYY-MM-DD
  allRequests: RentalRequest[],
  excludeRequestId?: string // when editing a request, don't count itself
): number {
  const reqStart = startOfDay(new Date(requestedStartDate));
  const reqEnd = startOfDay(new Date(requestedReturnDate));

  // Find all active/approved requests that have this resource and overlap
  const relevantRequests = allRequests.filter(req => 
    ['Approved', 'Active', 'Overdue'].includes(req.status) &&
    req.id !== excludeRequestId &&
    req.items && req.items.some(item => item.resourceId === resourceId)
  );

  let maxUsed = 0;

  // We check each day in the requested range to find the maximum overlapping quantity
  let currentDay = new Date(reqStart);
  while (currentDay <= reqEnd) {
    let usedOnThisDay = 0;

    for (const req of relevantRequests) {
      const rStart = startOfDay(new Date(req.startDate));
      const rEnd = startOfDay(new Date(req.returnDate));
      
      // If the current day falls within [rStart, rEnd], then it's used
      if (currentDay >= rStart && currentDay <= rEnd) {
        // Find how many of the specific resource were requested in this request
        const item = req.items.find(i => i.resourceId === resourceId);
        if (item) {
          usedOnThisDay += item.quantity;
        }
      }
    }

    if (usedOnThisDay > maxUsed) {
      maxUsed = usedOnThisDay;
    }

    // move to next day
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return Math.max(0, totalQuantity - maxUsed);
}

