import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import type { RamadanSettings, TimetableDay, RamadanReminder, ImportantNight, RamadanEvent, DailyDua } from '../../types';

const TABS = [
  { id: 'dates', label: '📅 Dates & Year' },
  { id: 'timetable', label: '🕐 Timetable' },
  { id: 'taraweeh', label: '🌙 Taraweeh' },
  { id: 'duas', label: '🤲 Daily Duas' },
  { id: 'reminders', label: '✨ Reminders' },
  { id: 'nights', label: '⭐ Last 10 Nights' },
  { id: 'timeline', label: '📆 Timeline' },
  { id: 'zakat', label: '💛 Zakat' },
];

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export default function ManageRamadan() {
  const { ramadanSettings, refresh } = useData();
  const [form, setForm] = useState<RamadanSettings>(ramadanSettings);
  const [activeTab, setActiveTab] = useState('dates');
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [expandedDua, setExpandedDua] = useState<number | null>(null);

  useEffect(() => { setForm(ramadanSettings); }, [ramadanSettings]);

  const save = async () => {
    setIsSaving(true);
    setMsg('');
    try {
      await api.setRamadanSettings(form);
      await refresh();
      setMsg('Saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const patchTaraweeh = (field: string, val: string) =>
    setForm(f => ({ ...f, taraweeh: { ...f.taraweeh, [field]: val } }));

  // ── Timetable helpers ────────────────────────────────────────────────
  const generateTimetable = () => {
    const rows: TimetableDay[] = [];
    const start = new Date(form.startDate);
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      rows.push({ day: i + 1, date: `${yyyy}-${mm}-${dd}`, sehri: '', iftar: '' });
    }
    setForm(f => ({ ...f, timetable: rows }));
  };

  const patchRow = (idx: number, field: 'sehri' | 'iftar', val: string) =>
    setForm(f => { const t = [...f.timetable]; t[idx] = { ...t[idx], [field]: val }; return { ...f, timetable: t }; });

  // ── Reminders ────────────────────────────────────────────────────────
  const addReminder = () => setForm(f => ({ ...f, reminders: [...f.reminders, { id: genId(), title: '', body: '', icon: '🌙' }] }));
  const patchReminder = (idx: number, field: keyof RamadanReminder, val: string) =>
    setForm(f => { const r = [...f.reminders]; r[idx] = { ...r[idx], [field]: val }; return { ...f, reminders: r }; });
  const removeReminder = (idx: number) => setForm(f => ({ ...f, reminders: f.reminders.filter((_, i) => i !== idx) }));

  // ── Last 10 Nights ───────────────────────────────────────────────────
  const generateNights = () => {
    const nights: ImportantNight[] = [21, 23, 25, 27, 29].map(n => ({
      night: n,
      title: n === 27 ? "Laylatul Qadr" : `${n}rd Night`,
      description: n === 27 ? "The Night of Power — better than a thousand months. Increase ibadah, dua, and seeking forgiveness." : 'Spend this night in extra prayers and remembrance of Allah.',
    }));
    setForm(f => ({ ...f, importantNights: nights }));
  };
  const patchNight = (idx: number, field: keyof ImportantNight, val: string | number) =>
    setForm(f => { const n = [...f.importantNights]; n[idx] = { ...n[idx], [field]: val }; return { ...f, importantNights: n }; });
  const removeNight = (idx: number) => setForm(f => ({ ...f, importantNights: f.importantNights.filter((_, i) => i !== idx) }));
  const addNight = () => setForm(f => ({ ...f, importantNights: [...f.importantNights, { night: 21, title: '', description: '' }] }));

  // ── Timeline ─────────────────────────────────────────────────────────
  const generateTimeline = () => {
    const start = new Date(form.startDate);
    const offset = (d: number) => {
      const dt = new Date(start); dt.setDate(dt.getDate() + d);
      return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    };
    const events: RamadanEvent[] = [
      { id: genId(), label: '1st Ramadan — Fasting Begins', date: offset(0), hijriDate: `1 Ramadan ${form.year}`, highlight: false },
      { id: genId(), label: 'Last 10 Nights Begin', date: offset(20), hijriDate: `21 Ramadan ${form.year}`, highlight: false },
      { id: genId(), label: "Laylatul Qadr (Probable Night)", date: offset(26), hijriDate: `27 Ramadan ${form.year}`, highlight: true },
      { id: genId(), label: 'Last Day of Ramadan', date: offset(29), hijriDate: `30 Ramadan ${form.year}`, highlight: false },
      { id: genId(), label: 'Eid al-Fitr 🎉', date: form.eidDate, hijriDate: `1 Shawwal ${form.year}`, highlight: true },
    ];
    setForm(f => ({ ...f, keyEvents: events }));
  };
  const patchEvent = (idx: number, field: keyof RamadanEvent, val: string | boolean) =>
    setForm(f => { const e = [...f.keyEvents]; e[idx] = { ...e[idx], [field]: val }; return { ...f, keyEvents: e }; });
  const removeEvent = (idx: number) => setForm(f => ({ ...f, keyEvents: f.keyEvents.filter((_, i) => i !== idx) }));
  const addEvent = () => setForm(f => ({ ...f, keyEvents: [...f.keyEvents, { id: genId(), label: '', date: '', hijriDate: '', highlight: false }] }));

  // ── Duas ─────────────────────────────────────────────────────────────
  const generateDuaTemplate = () => {
    const defaultDua: DailyDua = {
      day: 1,
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation: 'O Allah, You are Pardoning and You love pardon, so pardon me.',
    };
    const duas = Array.from({ length: 30 }, (_, i) => ({ ...defaultDua, day: i + 1 }));
    setForm(f => ({ ...f, duas }));
  };
  const patchDua = (idx: number, field: keyof DailyDua, val: string | number) =>
    setForm(f => { const d = [...f.duas]; d[idx] = { ...d[idx], [field]: val }; return { ...f, duas: d }; });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">Ramadan Configuration</h2>
        <button onClick={save} disabled={isSaving} className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 transition">
          <Save size={18} /> {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {msg && <div className={`p-4 rounded-xl font-bold ${msg.includes('success') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-bold rounded-xl text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-xl ring-1 ring-gray-100 rounded-2xl">
        <CardContent className="p-6 space-y-5">

          {/* ── DATES ─────────────────────────────────────────────── */}
          {activeTab === 'dates' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Set the Ramadan year and key dates. All other sections derive from the start date.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Hijri Year Label" value={form.year} onChange={v => setForm(f => ({ ...f, year: v }))} placeholder="1448 AH" />
                <Field label="Start Date (1st Ramadan)" type="date" value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} />
                <Field label="End Date (Last day of Ramadan)" type="date" value={form.endDate} onChange={v => setForm(f => ({ ...f, endDate: v }))} />
                <Field label="Eid al-Fitr Date" type="date" value={form.eidDate} onChange={v => setForm(f => ({ ...f, eidDate: v }))} />
              </div>
            </div>
          )}

          {/* ── TIMETABLE ─────────────────────────────────────────── */}
          {activeTab === 'timetable' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Enter Sehri (end) and Iftar times for all 30 days.</p>
                <button onClick={generateTimetable} className="text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition">
                  Auto-Generate 30 Rows
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-bold text-gray-700">Day</th>
                      <th className="p-3 text-left font-bold text-gray-700">Date</th>
                      <th className="p-3 text-left font-bold text-gray-700">Sehri Ends</th>
                      <th className="p-3 text-left font-bold text-gray-700">Iftar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {form.timetable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2 font-bold text-gray-500 text-center">{row.day}</td>
                        <td className="p-2 text-gray-600 text-xs">{row.date}</td>
                        <td className="p-2"><input type="time" value={toTime24(row.sehri)} onChange={e => patchRow(idx, 'sehri', toTime12(e.target.value))} className="border rounded-lg px-2 py-1 text-sm w-full" /></td>
                        <td className="p-2"><input type="time" value={toTime24(row.iftar)} onChange={e => patchRow(idx, 'iftar', toTime12(e.target.value))} className="border rounded-lg px-2 py-1 text-sm w-full" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {form.timetable.length === 0 && (
                  <div className="p-8 text-center text-gray-400 font-medium">Click "Auto-Generate 30 Rows" to populate the timetable.</div>
                )}
              </div>
            </div>
          )}

          {/* ── TARAWEEH ──────────────────────────────────────────── */}
          {activeTab === 'taraweeh' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Start Time" value={form.taraweeh.time} onChange={v => patchTaraweeh('time', v)} placeholder="After Isha (8:15 PM)" />
                <Field label="Number of Rak'ahs" value={form.taraweeh.rakaat} onChange={v => patchTaraweeh('rakaat', v)} placeholder="20" />
                <Field label="Imam / Reciter Name" value={form.taraweeh.imam} onChange={v => patchTaraweeh('imam', v)} placeholder="Hafiz Abdullah" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Special Nights (e.g. "27th Night — Khatm ul-Quran")</label>
                {form.taraweeh.specialNights.map((n, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={n} onChange={e => { const s = [...form.taraweeh.specialNights]; s[i] = e.target.value; setForm(f => ({ ...f, taraweeh: { ...f.taraweeh, specialNights: s } })); }} className="flex-1 border rounded-xl px-3 py-2 text-sm" />
                    <button onClick={() => { const s = form.taraweeh.specialNights.filter((_, j) => j !== i); setForm(f => ({ ...f, taraweeh: { ...f.taraweeh, specialNights: s } })); }} className="text-red-500 p-2 rounded-lg hover:bg-red-50"><Trash2 size={18} /></button>
                  </div>
                ))}
                <button onClick={() => setForm(f => ({ ...f, taraweeh: { ...f.taraweeh, specialNights: [...f.taraweeh.specialNights, ''] } }))} className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Night</button>
              </div>
            </div>
          )}

          {/* ── DUAS ──────────────────────────────────────────────── */}
          {activeTab === 'duas' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Set a unique dua for each day of Ramadan (Day 1 – 30).</p>
                <button onClick={generateDuaTemplate} className="text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-emerald-50">
                  Generate 30 Template Rows
                </button>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {form.duas.map((dua, idx) => (
                  <div key={idx} className="border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedDua(expandedDua === idx ? null : idx)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 text-left"
                    >
                      <span className="font-bold text-sm text-gray-800">Day {dua.day}</span>
                      {expandedDua === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedDua === idx && (
                      <div className="p-4 border-t bg-gray-50 space-y-3">
                        <div>
                          <label className="text-xs font-bold text-gray-600 mb-1 block">Arabic Text (Right to Left)</label>
                          <textarea value={dua.arabic} onChange={e => patchDua(idx, 'arabic', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-right text-lg" dir="rtl" rows={2} style={{ fontFamily: "'Amiri', serif" }} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-600 mb-1 block">Transliteration</label>
                          <input value={dua.transliteration} onChange={e => patchDua(idx, 'transliteration', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm italic" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-600 mb-1 block">English Translation</label>
                          <textarea value={dua.translation} onChange={e => patchDua(idx, 'translation', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" rows={2} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {form.duas.length === 0 && <div className="text-center text-gray-400 py-8">No duas yet. Click "Generate 30 Template Rows" to start.</div>}
              </div>
            </div>
          )}

          {/* ── REMINDERS ─────────────────────────────────────────── */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Add spiritual tip cards shown on the Ramadan page.</p>
              {form.reminders.map((rem, idx) => (
                <div key={rem.id} className="border rounded-2xl p-4 space-y-3 relative group bg-gray-50">
                  <button onClick={() => removeReminder(idx)} className="absolute top-3 right-3 text-red-400 hover:bg-red-100 p-1.5 rounded-lg transition"><Trash2 size={16} /></button>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Icon (Emoji)</label>
                      <input value={rem.icon} onChange={e => patchReminder(idx, 'icon', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-center text-2xl" maxLength={2} />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Title</label>
                      <input value={rem.title} onChange={e => patchReminder(idx, 'title', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm font-bold" placeholder="Increase Your Dhikr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Body Text</label>
                    <textarea value={rem.body} onChange={e => patchReminder(idx, 'body', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" rows={2} placeholder="A short spiritual reminder..." />
                  </div>
                </div>
              ))}
              <button onClick={addReminder} className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-emerald-50 rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition">
                <Plus size={20} /> Add Reminder Card
              </button>
            </div>
          )}

          {/* ── LAST 10 NIGHTS ────────────────────────────────────── */}
          {activeTab === 'nights' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Configure the last 10 odd nights of Ramadan.</p>
                <button onClick={generateNights} className="text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-emerald-50">Auto-Generate (21–29)</button>
              </div>
              {form.importantNights.map((n, idx) => (
                <div key={idx} className="border rounded-2xl p-4 space-y-3 bg-gray-50 relative">
                  <button onClick={() => removeNight(idx)} className="absolute top-3 right-3 text-red-400 hover:bg-red-100 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Night #</label>
                      <input type="number" value={n.night} onChange={e => patchNight(idx, 'night', Number(e.target.value))} className="w-full border rounded-xl px-3 py-2 text-sm font-bold" min={20} max={30} />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Title</label>
                      <input value={n.title} onChange={e => patchNight(idx, 'title', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Description</label>
                    <textarea value={n.description} onChange={e => patchNight(idx, 'description', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" rows={2} />
                  </div>
                </div>
              ))}
              <button onClick={addNight} className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-emerald-50 rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition">
                <Plus size={20} /> Add Night
              </button>
            </div>
          )}

          {/* ── TIMELINE ──────────────────────────────────────────── */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Key events shown on the Islamic timeline.</p>
                <button onClick={generateTimeline} className="text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-lg hover:bg-emerald-50">Auto-Generate</button>
              </div>
              {form.keyEvents.map((ev, idx) => (
                <div key={ev.id} className="border rounded-2xl p-4 space-y-3 bg-gray-50 relative">
                  <button onClick={() => removeEvent(idx)} className="absolute top-3 right-3 text-red-400 hover:bg-red-100 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Event Label</label>
                      <input value={ev.label} onChange={e => patchEvent(idx, 'label', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Date</label>
                      <input type="date" value={ev.date} onChange={e => patchEvent(idx, 'date', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Hijri Date Label</label>
                      <input value={ev.hijriDate} onChange={e => patchEvent(idx, 'hijriDate', e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="1 Ramadan 1448 AH" />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={ev.highlight} onChange={e => patchEvent(idx, 'highlight', e.target.checked)} className="w-4 h-4 rounded accent-amber-500" />
                        <span className="text-sm font-bold text-gray-700">Highlight</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addEvent} className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-emerald-50 rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition">
                <Plus size={20} /> Add Event
              </button>
            </div>
          )}

          {/* ── ZAKAT ─────────────────────────────────────────────── */}
          {activeTab === 'zakat' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Set the Nisab gold weight used in the Zakat calculator.</p>
              <div className="max-w-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">Nisab Gold Weight (grams)</label>
                <input
                  type="number"
                  value={form.nisabGoldGrams}
                  onChange={e => setForm(f => ({ ...f, nisabGoldGrams: Number(e.target.value) }))}
                  className="w-full border-2 border-gray-200 focus:border-amber-400 rounded-xl px-4 py-3 text-lg font-bold outline-none"
                />
                <p className="text-xs text-gray-400 mt-2">Standard Hanafi Nisab: 87.48g | Standard Shafi'i: 85g</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-sm text-amber-700 font-medium">
                💡 The gold <em>rate</em> per gram is entered by the user on the public page, so you don't need to update it here.
                Just keep the Nisab weight up to date.
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

// ── Helper UI ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border-2 border-gray-200 focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-sm outline-none transition" />
    </div>
  );
}

function toTime24(t12: string): string {
  if (!t12) return '';
  try {
    const [time, mer] = t12.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (mer?.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (mer?.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  } catch { return ''; }
}

function toTime12(t24: string): string {
  if (!t24) return '';
  const [h, m] = t24.split(':').map(Number);
  const mer = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${mer}`;
}
