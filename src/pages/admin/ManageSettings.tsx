import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { api } from '../../services/api';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import type { MasjidInfo, LocationInfo, DonationInfo, NikahInfo, JumuahInfo, ContactPerson } from '../../types';

export default function ManageSettings() {
  const { masjidInfo, locationInfo, donationInfo, nikahInfo, jumuahInfo, contacts, refresh } = useData();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Local State for Forms
  const [formMasjid, setFormMasjid] = useState<MasjidInfo>(masjidInfo);
  const [formLocation, setFormLocation] = useState<LocationInfo>(locationInfo);
  const [formDonation, setFormDonation] = useState<DonationInfo>(donationInfo);
  const [formNikah, setFormNikah] = useState<NikahInfo>(nikahInfo);
  const [formJumuah, setFormJumuah] = useState<JumuahInfo>(jumuahInfo);
  const [formContacts, setFormContacts] = useState<ContactPerson[]>(contacts);

  // Sync state if context updates
  useEffect(() => {
    setFormMasjid(masjidInfo);
    setFormLocation(locationInfo);
    setFormDonation(donationInfo);
    setFormNikah(nikahInfo);
    setFormJumuah(jumuahInfo);
    setFormContacts(contacts);
  }, [masjidInfo, locationInfo, donationInfo, nikahInfo, jumuahInfo, contacts]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      if (activeTab === 'general') await api.setMasjidInfo(formMasjid);
      if (activeTab === 'location') await api.setLocationInfo(formLocation);
      if (activeTab === 'donations') await api.setDonationInfo(formDonation);
      if (activeTab === 'services') {
        await api.setNikahInfo(formNikah);
        await api.setJumuahInfo(formJumuah);
      }
      if (activeTab === 'contacts') await api.setContacts(formContacts);
      
      await refresh();
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'location', label: 'Location' },
    { id: 'donations', label: 'Donations' },
    { id: 'services', label: 'Nikah & Jumuah' },
    { id: 'contacts', label: 'Contacts' },
  ];

  const handleArrayChange = (setter: any, field: string, index: number, value: string) => {
    setter((prev: any) => {
      const newArr = [...prev[field]];
      newArr[index] = value;
      return { ...prev, [field]: newArr };
    });
  };

  const addArrayItem = (setter: any, field: string) => {
    setter((prev: any) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (setter: any, field: string, index: number) => {
    setter((prev: any) => {
      const newArr = prev[field].filter((_: any, i: number) => i !== index);
      return { ...prev, [field]: newArr };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">Site Configuration</h2>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl font-bold ${message.includes('success') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-bold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-xl ring-1 ring-gray-100 rounded-2xl">
        <CardContent className="p-6 space-y-6">
          
          {/* GENERAL INFO */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Masjid Name</label>
                <input type="text" value={formMasjid.name} onChange={e => setFormMasjid({...formMasjid, name: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Established Year <span className="text-gray-400 font-normal">(shown on Home page stats)</span></label>
                <input type="text" value={formMasjid.establishedYear} onChange={e => setFormMasjid({...formMasjid, establishedYear: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="e.g. 2000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mission Statement (Home Page)</label>
                <textarea value={formMasjid.mission} onChange={e => setFormMasjid({...formMasjid, mission: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">History (About Page)</label>
                <textarea value={formMasjid.history} onChange={e => setFormMasjid({...formMasjid, history: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={4} />
              </div>
            </div>
          )}

          {/* LOCATION */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location Name</label>
                <input type="text" value={formLocation.name} onChange={e => setFormLocation({...formLocation, name: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Formatted Address (Shows in Footer)</label>
                <textarea value={formLocation.address} onChange={e => setFormLocation({...formLocation, address: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Landmark</label>
                <input type="text" value={formLocation.landmark} onChange={e => setFormLocation({...formLocation, landmark: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Maps Link</label>
                <input type="text" value={formLocation.mapsLink} onChange={e => setFormLocation({...formLocation, mapsLink: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
            </div>
          )}

          {/* DONATIONS */}
          {activeTab === 'donations' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Bank Name</label>
                  <input type="text" value={formDonation.bankName} onChange={e => setFormDonation({...formDonation, bankName: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Account Name</label>
                  <input type="text" value={formDonation.accountName} onChange={e => setFormDonation({...formDonation, accountName: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Account Number</label>
                  <input type="text" value={formDonation.accountNumber} onChange={e => setFormDonation({...formDonation, accountNumber: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">IFSC Code</label>
                  <input type="text" value={formDonation.ifsc} onChange={e => setFormDonation({...formDonation, ifsc: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">UPI ID</label>
                  <input type="text" value={formDonation.upiId} onChange={e => setFormDonation({...formDonation, upiId: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contact Person</label>
                  <input type="text" value={formDonation.contactPerson} onChange={e => setFormDonation({...formDonation, contactPerson: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Instructions</label>
                <textarea value={formDonation.instructions} onChange={e => setFormDonation({...formDonation, instructions: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={3} />
              </div>
            </div>
          )}

          {/* NIKAH & JUMUAH */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-black text-gray-900 border-b pb-2 mb-4">Jumuah Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jumuah Notes / Instructions</label>
                    <textarea value={formJumuah.notes} onChange={e => setFormJumuah({...formJumuah, notes: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={2} />
                  </div>
                  
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jumuah Sessions</label>
                  {formJumuah.sessions.map((sess, idx) => (
                    <div key={sess.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <label className="text-xs text-gray-500">Khateeb</label>
                        <input type="text" value={sess.khateeb} onChange={e => {
                          const newSess = [...formJumuah.sessions];
                          newSess[idx].khateeb = e.target.value;
                          setFormJumuah({...formJumuah, sessions: newSess});
                        }} className="w-full text-sm border-gray-300 rounded-lg p-1.5 border" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Khutbah Time</label>
                        <input type="time" value={sess.khutbahTime} onChange={e => {
                          const newSess = [...formJumuah.sessions];
                          newSess[idx].khutbahTime = e.target.value;
                          setFormJumuah({...formJumuah, sessions: newSess});
                        }} className="w-full text-sm border-gray-300 rounded-lg p-1.5 border" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Jamaah Time</label>
                        <input type="time" value={sess.jamaahTime} onChange={e => {
                          const newSess = [...formJumuah.sessions];
                          newSess[idx].jamaahTime = e.target.value;
                          setFormJumuah({...formJumuah, sessions: newSess});
                        }} className="w-full text-sm border-gray-300 rounded-lg p-1.5 border" />
                      </div>
                      <div className="flex items-end">
                         <button onClick={() => {
                           const newSess = formJumuah.sessions.filter((_, i) => i !== idx);
                           setFormJumuah({...formJumuah, sessions: newSess});
                         }} className="text-red-500 hover:bg-red-100 p-1.5 rounded-lg w-full flex justify-center">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setFormJumuah({...formJumuah, sessions: [...formJumuah.sessions, {id: Date.now().toString(), khateeb:'', khutbahTime:'', jamaahTime:''}]})} className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 hover:underline"><Plus size={16}/> Add Session</button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-900 border-b pb-2 mb-4">Nikah Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Introduction</label>
                    <textarea value={formNikah.introduction} onChange={e => setFormNikah({...formNikah, introduction: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Procedure</label>
                    <textarea value={formNikah.procedure} onChange={e => setFormNikah({...formNikah, procedure: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" rows={2} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Contact Person</label>
                      <input type="text" value={formNikah.contactPerson} onChange={e => setFormNikah({...formNikah, contactPerson: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Contact Phone</label>
                      <input type="text" value={formNikah.contactPhone} onChange={e => setFormNikah({...formNikah, contactPhone: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Requirements</label>
                    {formNikah.requirements.map((req, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" value={req} onChange={e => handleArrayChange(setFormNikah, 'requirements', idx, e.target.value)} className="flex-1 border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                        <button onClick={() => removeArrayItem(setFormNikah, 'requirements', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={20}/></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem(setFormNikah, 'requirements')} className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 hover:underline"><Plus size={16}/> Add Requirement</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">Manage the directory of committee members and key contacts.</p>
              
              {formContacts.map((contact, idx) => (
                <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border relative group">
                  <button 
                    onClick={() => setFormContacts(formContacts.filter((_, i) => i !== idx))}
                    className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Name</label>
                    <input type="text" value={contact.name} onChange={e => {
                      const newC = [...formContacts];
                      newC[idx].name = e.target.value;
                      setFormContacts(newC);
                    }} className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Role</label>
                    <input type="text" value={contact.role} onChange={e => {
                      const newC = [...formContacts];
                      newC[idx].role = e.target.value;
                      setFormContacts(newC);
                    }} className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Phone</label>
                    <input type="text" value={contact.phone} onChange={e => {
                      const newC = [...formContacts];
                      newC[idx].phone = e.target.value;
                      setFormContacts(newC);
                    }} className="w-full text-sm border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setFormContacts([...formContacts, { id: Date.now().toString(), name: '', role: '', phone: '' }])}
                className="mt-4 border-2 border-dashed border-gray-300 text-gray-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-emerald-50 rounded-xl p-4 w-full flex items-center justify-center gap-2 font-bold transition-all"
              >
                <Plus size={20} />
                Add New Contact
              </button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
