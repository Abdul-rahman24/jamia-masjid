import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import type { RentalRequest, RentalStatus } from '../../types';
import { format } from 'date-fns';

export default function ManageRentals() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const resources = api.getResources();

  useEffect(() => {
    setRequests(api.getRentalRequests().reverse());
  }, []);

  const updateStatus = (id: string, newStatus: RentalStatus) => {
    const updated = requests.map(req => req.id === id ? { ...req, status: newStatus } : req);
    setRequests(updated);
    api.setRentalRequests(updated.reverse()); // Keep chronological order in DB
  };

  const getResourceName = (id: string) => resources.find(r => r.id === id)?.name || 'Unknown Item';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Rentals</h1>
      
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600">Request</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Item & Qty</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Dates</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{req.customerName}</p>
                    <p className="text-sm text-gray-500">{req.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">{req.purpose}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold">{getResourceName(req.resourceId)}</p>
                    <p className="text-sm text-gray-500">Qty: {req.quantity}</p>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <p><span className="text-gray-500">From:</span> {format(new Date(req.startDate), 'MMM d, yyyy')}</p>
                    <p><span className="text-gray-500">To:</span> {format(new Date(req.returnDate), 'MMM d, yyyy')}</p>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={
                      req.status === 'Pending' ? 'warning' :
                      req.status === 'Approved' ? 'success' :
                      req.status === 'Active' ? 'info' :
                      req.status === 'Rejected' ? 'error' : 'default'
                    }>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {req.status === 'Pending' && (
                      <>
                        <button onClick={() => updateStatus(req.id, 'Approved')} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100 font-medium">Approve</button>
                        <button onClick={() => updateStatus(req.id, 'Rejected')} className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded hover:bg-red-100 font-medium">Reject</button>
                      </>
                    )}
                    {req.status === 'Approved' && (
                      <button onClick={() => updateStatus(req.id, 'Active')} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 font-medium">Mark Active (Given)</button>
                    )}
                    {req.status === 'Active' && (
                      <button onClick={() => updateStatus(req.id, 'Returned')} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 font-medium">Mark Returned</button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No rental requests found.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

