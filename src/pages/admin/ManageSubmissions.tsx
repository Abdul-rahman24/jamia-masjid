import { useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { format } from 'date-fns';
import { Phone, Clock, Eye } from 'lucide-react';
import type { SubmissionStatus, RentalStatus } from '../../types';
import { useData } from '../../contexts/DataContext';

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Seen: 'bg-blue-100 text-blue-800',
  Done: 'bg-green-100 text-green-800'
};

const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Active: 'bg-blue-100 text-blue-800',
  Returned: 'bg-purple-100 text-purple-800',
  Overdue: 'bg-red-600 text-white'
};

const STATUSES: SubmissionStatus[] = ['Pending', 'Seen', 'Done'];
const RENTAL_STATUSES: RentalStatus[] = ['Pending', 'Approved', 'Rejected', 'Active', 'Returned', 'Overdue'];

export default function ManageSubmissions() {
  const { resources, rentalRequests, janaazahSubmissions, nikahSubmissions } = useData();
  const [tab, setTab] = useState<'janaazah' | 'nikah' | 'rental'>('janaazah');
  const [janSubs, setJanSubs] = useState(janaazahSubmissions);
  const [nikSubs, setNikSubs] = useState(nikahSubmissions);
  const [rentSubs, setRentSubs] = useState(rentalRequests);
  
  const updateJanStatus = (id: string, status: SubmissionStatus) => {
    const updated = janSubs.map(s => s.id === id ? { ...s, status } : s);
    setJanSubs(updated);
    updated.forEach(s => api.updateJanaazahSubmission(s));
  };

  const updateNikStatus = (id: string, status: SubmissionStatus) => {
    const updated = nikSubs.map(s => s.id === id ? { ...s, status } : s);
    setNikSubs(updated);
    updated.forEach(s => api.updateNikahSubmission(s));
  };

  const updateRentStatus = (id: string, status: RentalStatus) => {
    const updated = rentSubs.map(s => s.id === id ? { ...s, status } : s);
    setRentSubs(updated);
    updated.forEach(s => api.updateRentalRequest(s));
  };

  const getResourceName = (id: string) => resources.find(r => r.id === id)?.name || 'Unknown Resource';

  const pendingJan = janSubs.filter(s => s.status === 'Pending').length;
  const pendingNik = nikSubs.filter(s => s.status === 'Pending').length;
  const pendingRent = rentSubs.filter(s => s.status === 'Pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-500 text-sm">Manage Janaazah, Nikah, and Rental requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setTab('janaazah')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            tab === 'janaazah' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Janaazah
          {pendingJan > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingJan}</span>}
        </button>
        <button onClick={() => setTab('nikah')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            tab === 'nikah' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Nikah
          {pendingNik > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingNik}</span>}
        </button>
        <button onClick={() => setTab('rental')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            tab === 'rental' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Rentals
          {pendingRent > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingRent}</span>}
        </button>
      </div>

      {/* Janaazah submissions */}
      {tab === 'janaazah' && (
        <div className="space-y-4">
          {janSubs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-400">No Janaazah submissions yet.</CardContent></Card>
          ) : (
            [...janSubs].reverse().map(s => (
              <Card key={s.id} className="overflow-hidden">
                <div className={`h-1 w-full ${s.status === 'Pending' ? 'bg-yellow-400' : s.status === 'Seen' ? 'bg-blue-400' : 'bg-green-400'}`} />
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                        {s.submitterName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{s.submitterName}</p>
                        <a href={`tel:${s.submitterPhone}`} className="flex items-center gap-1 text-[var(--color-primary)] font-semibold text-sm">
                          <Phone size={14} />{s.submitterPhone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
                    <div className="flex items-center gap-1 text-gray-500"><Clock size={14} /> {format(new Date(s.submittedAt), 'MMM d, yyyy h:mm a')}</div>
                    {s.fileName && <div className="flex items-center gap-1 text-blue-600"><Eye size={14} /> {s.fileName}</div>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(st => (
                      <button key={st} onClick={() => updateJanStatus(s.id, st)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          s.status === st ? STATUS_COLORS[st] + ' border-transparent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        Mark {st}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Nikah submissions */}
      {tab === 'nikah' && (
        <div className="space-y-4">
          {nikSubs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-400">No Nikah submissions yet.</CardContent></Card>
          ) : (
            [...nikSubs].reverse().map(s => (
              <Card key={s.id} className="overflow-hidden">
                <div className={`h-1 w-full ${s.status === 'Pending' ? 'bg-yellow-400' : s.status === 'Seen' ? 'bg-blue-400' : 'bg-green-400'}`} />
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">
                        {s.submitterName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{s.submitterName}</p>
                        <a href={`tel:${s.submitterPhone}`} className="flex items-center gap-1 text-[var(--color-primary)] font-semibold text-sm">
                          <Phone size={14} />{s.submitterPhone}
                        </a>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                    <div><span className="font-semibold text-gray-500">Preferred Date:</span> <span className="font-bold text-gray-900">{format(new Date(s.preferredDate), 'MMMM d, yyyy')}</span></div>
                    <div><span className="font-semibold text-gray-500">Submitted:</span> {format(new Date(s.submittedAt), 'MMM d, yyyy')}</div>
                    <div><span className="font-semibold text-gray-500">Groom:</span> {s.groomName}</div>
                    <div><span className="font-semibold text-gray-500">Bride:</span> {s.brideName}</div>
                    {s.groomProof && <div className="flex items-center gap-1 text-blue-600 sm:col-span-2"><Eye size={14} /> Groom ID: {s.groomProof}</div>}
                    {s.brideProof && <div className="flex items-center gap-1 text-pink-600 sm:col-span-2"><Eye size={14} /> Bride ID: {s.brideProof}</div>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(st => (
                      <button key={st} onClick={() => updateNikStatus(s.id, st)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          s.status === st ? STATUS_COLORS[st] + ' border-transparent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        Mark {st}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Rental submissions */}
      {tab === 'rental' && (
        <div className="space-y-4">
          {rentSubs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-400">No Rental requests yet.</CardContent></Card>
          ) : (
            [...rentSubs].reverse().map(s => (
              <Card key={s.id} className="overflow-hidden">
                <div className={`h-1 w-full ${s.status === 'Pending' ? 'bg-yellow-400' : s.status === 'Approved' ? 'bg-green-400' : 'bg-blue-400'}`} />
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                        {s.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{s.customerName}</p>
                        <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-[var(--color-primary)] font-semibold text-sm">
                          <Phone size={14} />{s.phone}
                        </a>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${RENTAL_STATUS_COLORS[s.status] || 'bg-gray-100'}`}>{s.status}</span>
                  </div>

                  <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Requested Items</h4>
                    <ul className="space-y-1">
                      {s.items?.map((item, idx) => (
                        <li key={idx} className="text-sm font-medium text-gray-900 flex justify-between">
                          <span>{getResourceName(item.resourceId)}</span>
                          <span className="text-blue-600 font-bold">Qty: {item.quantity}</span>
                        </li>
                      ))}
                      {/* Backwards compatibility for old data */}
                      {(s as any).resourceId && (
                        <li className="text-sm font-medium text-gray-900 flex justify-between">
                          <span>{getResourceName((s as any).resourceId)}</span>
                          <span className="text-blue-600 font-bold">Qty: {(s as any).quantity}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
                    <div><span className="font-semibold text-gray-500">Dates:</span> <span className="font-bold text-gray-900">{format(new Date(s.startDate), 'MMM d')} to {format(new Date(s.returnDate), 'MMM d, yyyy')}</span></div>
                    <div><span className="font-semibold text-gray-500">Purpose:</span> {s.purpose}</div>
                    <div className="sm:col-span-2 text-gray-500 text-xs">Submitted on {format(new Date(s.createdAt), 'MMM d, yyyy h:mm a')}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {RENTAL_STATUSES.map(st => (
                      <button key={st} onClick={() => updateRentStatus(s.id, st)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          s.status === st ? RENTAL_STATUS_COLORS[st] + ' border-transparent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        Mark {st}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
