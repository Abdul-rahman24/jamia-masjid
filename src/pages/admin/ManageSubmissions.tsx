import { useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { format } from 'date-fns';
import { Phone, Clock, Eye, Plus, X, Upload } from 'lucide-react';
import type { SubmissionStatus, RentalStatus, Janaazah } from '../../types';
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
  const { resources, rentalRequests, janaazahSubmissions, nikahSubmissions, janaazah } = useData();
  const [tab, setTab] = useState<'janaazah' | 'nikah' | 'rental'>('janaazah');
  const [janSubs, setJanSubs] = useState(janaazahSubmissions);
  const [nikSubs, setNikSubs] = useState(nikahSubmissions);
  const [rentSubs, setRentSubs] = useState(rentalRequests);
  const [notices, setNotices] = useState(janaazah);

  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeForm, setNoticeForm] = useState<Partial<Janaazah>>({
    name: '', date: '', prayerTime: '', prayerLocation: 'Jamia Masjid Kattumavadi', burialLocation: 'Kattumavadi Qabarstan'
  });
  const [noticeText, setNoticeText] = useState('');
  const [noticeFile, setNoticeFile] = useState<File | null>(null);

  const toggleNoticeActive = async (id: string, active: boolean) => {
    const notice = notices.find(n => n.id === id);
    if (!notice) return;
    const updated = { ...notice, active };
    setNotices(notices.map(n => n.id === id ? updated : n));
    await api.updateJanaazahNotice(updated);
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finishSave = async (infoStr: string) => {
      await api.addJanaazahNotice({ ...noticeForm, additionalInfo: infoStr, active: true } as Janaazah);
      window.location.reload();
    };

    if (noticeFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        finishSave(JSON.stringify({ text: noticeText, attachmentName: noticeFile.name, attachmentData: base64data }));
      };
      reader.readAsDataURL(noticeFile);
    } else {
      finishSave(noticeText ? JSON.stringify({ text: noticeText }) : '');
    }
  };
  
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
        <div className="space-y-8">
          
          {/* Public Notices Section */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-gray-900">Active Public Notices</h2>
              <button onClick={() => setShowNoticeForm(true)} className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-800">
                <Plus size={16} /> Create Notice
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {notices.filter(n => n.active).length === 0 && <p className="text-gray-500 text-sm">No active public notices.</p>}
              {notices.filter(n => n.active).map(n => {
                let text = n.additionalInfo;
                let hasFile = false;
                try {
                  if (text?.startsWith('{')) {
                    const parsed = JSON.parse(text);
                    text = parsed.text;
                    hasFile = !!parsed.attachmentData;
                  }
                } catch(e) {}
                
                return (
                  <Card key={n.id} className="border-l-4 border-l-gray-900">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{n.name}</h3>
                        <button onClick={() => toggleNoticeActive(n.id, false)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-bold hover:bg-red-100 transition-colors">Archive</button>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="font-semibold text-gray-700">Date:</span> {format(new Date(n.date), 'MMM d, yyyy')}</p>
                        <p><span className="font-semibold text-gray-700">Time:</span> {n.prayerTime}</p>
                      </div>
                      {hasFile && <p className="mt-2 text-xs font-bold text-[var(--color-primary)]">📎 PDF Attached</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Submissions Section */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Submissions (From Users)</h2>
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
                    {s.fileName && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Eye size={14} />
                        {(() => {
                          let name = s.fileName;
                          let data = null;
                          try {
                            const parsed = JSON.parse(s.fileName);
                            name = parsed.name;
                            data = parsed.data;
                          } catch(e) {}
                          
                          if (data) {
                            return (
                              <a href={data} download={name} className="hover:underline font-bold flex items-center gap-2">
                                {name} <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Download PDF</span>
                              </a>
                            );
                          }
                          return <span>{name}</span>;
                        })()}
                      </div>
                    )}
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
          </section>
        </div>
      )}

      {/* Modal for Create Notice */}
      {showNoticeForm && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-black text-gray-900 text-lg">Create Janaazah Notice</h3>
              <button onClick={() => setShowNoticeForm(false)}><X size={22} className="text-gray-400 hover:text-gray-900" /></button>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleCreateNotice} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Deceased Name *</label>
                  <input required value={noticeForm.name} onChange={e => setNoticeForm({...noticeForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Full Name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date *</label>
                    <input required type="date" value={noticeForm.date} onChange={e => setNoticeForm({...noticeForm, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Prayer Time *</label>
                    <input required type="time" value={noticeForm.prayerTime} onChange={e => setNoticeForm({...noticeForm, prayerTime: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prayer Location *</label>
                  <input required value={noticeForm.prayerLocation} onChange={e => setNoticeForm({...noticeForm, prayerLocation: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Burial Location *</label>
                  <input required value={noticeForm.burialLocation} onChange={e => setNoticeForm({...noticeForm, burialLocation: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Announcement Text (Optional)</label>
                  <textarea value={noticeText} onChange={e => setNoticeText(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Any additional details..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Attach PDF/Image (Optional)</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload size={24} className="text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">{noticeFile ? noticeFile.name : 'Click to select a file'}</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setNoticeFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Publish Notice</button>
                </div>
              </form>
            </CardContent>
          </Card>
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
                    {s.groomProof && (
                      <div className="flex items-center gap-1 text-blue-600 sm:col-span-2">
                        <Eye size={14} /> Groom ID: 
                        {(() => {
                          let name = s.groomProof;
                          let data = null;
                          try {
                            const parsed = JSON.parse(s.groomProof!);
                            name = parsed.name;
                            data = parsed.data;
                          } catch(e) {}
                          if (data) {
                            return <a href={data} download={name} className="hover:underline font-bold flex items-center gap-2">{name} <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Download</span></a>;
                          }
                          return <span>{name}</span>;
                        })()}
                      </div>
                    )}
                    {s.brideProof && (
                      <div className="flex items-center gap-1 text-pink-600 sm:col-span-2">
                        <Eye size={14} /> Bride ID: 
                        {(() => {
                          let name = s.brideProof;
                          let data = null;
                          try {
                            const parsed = JSON.parse(s.brideProof!);
                            name = parsed.name;
                            data = parsed.data;
                          } catch(e) {}
                          if (data) {
                            return <a href={data} download={name} className="hover:underline font-bold flex items-center gap-2">{name} <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Download</span></a>;
                          }
                          return <span>{name}</span>;
                        })()}
                      </div>
                    )}
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
