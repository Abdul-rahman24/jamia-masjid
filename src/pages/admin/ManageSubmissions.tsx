import { useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { format } from 'date-fns';
import type { JanaazahSubmission, NikahSubmission, SubmissionStatus } from '../../types';
import { CheckCircle2, Clock, Eye, Phone } from 'lucide-react';

type Tab = 'janaazah' | 'nikah';

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Seen:    'bg-blue-100 text-blue-800',
  Done:    'bg-green-100 text-green-800',
};

const STATUSES: SubmissionStatus[] = ['Pending', 'Seen', 'Done'];

export default function ManageSubmissions() {
  const [tab, setTab] = useState<Tab>('janaazah');
  const [janSubs, setJanSubs] = useState<JanaazahSubmission[]>(() => api.getJanaazahSubmissions());
  const [nikSubs, setNikSubs] = useState<NikahSubmission[]>(() => api.getNikahSubmissions());

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

  const pendingJan = janSubs.filter(s => s.status === 'Pending').length;
  const pendingNik = nikSubs.filter(s => s.status === 'Pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-500 text-sm">Janaazah and Nikah form submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
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
                        {st === 'Pending' ? '⏳' : st === 'Seen' ? '👁' : '✅'} Mark {st}
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
                        {st === 'Pending' ? '⏳' : st === 'Seen' ? '👁' : '✅'} Mark {st}
                      </button>
                    ))}
                  </div>

                  {/* Quick call note */}
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span className="text-xs text-gray-500">Call applicant to confirm date: <strong>{s.submitterPhone}</strong></span>
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
