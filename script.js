const fs = require('fs');

const content = import { useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { format } from 'date-fns';
import { Plus, X, Upload, Image as ImageIcon, Trash2, Megaphone } from 'lucide-react';
import type { Announcement } from '../../types';
import { useData } from '../../contexts/DataContext';

export default function ManageAnnouncements() {
  const { announcements } = useData();
  const [list, setList] = useState(announcements);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('General');
  const [priority, setPriority] = useState<Announcement['priority']>('Normal');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const openForm = (a?: Announcement) => {
    if (a) {
      setEditingId(a.id);
      setTitle(a.title);
      setCategory(a.category);
      setPriority(a.priority);
      
      try {
        const parsed = JSON.parse(a.description);
        setText(parsed.text || '');
        setExistingImage(parsed.image || null);
      } catch (e) {
        setText(a.description);
        setExistingImage(null);
      }
    } else {
      setEditingId(null);
      setTitle('');
      setCategory('General');
      setPriority('Normal');
      setText('');
      setExistingImage(null);
    }
    setFile(null);
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const toggleActive = async (id: string, active: boolean) => {
    const item = list.find(x => x.id === id);
    if (!item) return;
    const updated = { ...item, active };
    setList(list.map(x => x.id === id ? updated : x));
    await api.updateAnnouncement(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finishSave = async (descPayload: string) => {
      const payload: Partial<Announcement> = {
        title,
        description: descPayload,
        category,
        priority,
        active: true,
      };
      
      if (editingId) {
        await api.updateAnnouncement({ ...payload, id: editingId, publishedDate: list.find(a=>a.id===editingId)?.publishedDate || new Date().toISOString() } as Announcement);
      } else {
        await api.addAnnouncement(payload);
      }
      window.location.reload();
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        finishSave(JSON.stringify({ text, image: base64 }));
      };
      reader.readAsDataURL(file);
    } else {
      finishSave(JSON.stringify({ text, image: existingImage }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm">Manage public announcements</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow">
          <Plus size={18} /> Add Announcement
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 ? (
          <Card className="col-span-full"><CardContent className="p-8 text-center text-gray-500">No announcements yet.</CardContent></Card>
        ) : (
          [...list].reverse().map(a => {
            let descText = a.description;
            let img = null;
            try {
              const parsed = JSON.parse(a.description);
              descText = parsed.text;
              img = parsed.image;
            } catch(e) {}

            return (
              <Card key={a.id} className={\overflow-hidden border-t-4 \\}>
                {img && (
                  <div className="h-40 w-full bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img src={img} alt="Announcement" className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{a.category}</span>
                    <span className={\px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider \\}>
                      {a.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{descText}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button onClick={() => openForm(a)} className="text-sm font-bold text-[var(--color-primary)] hover:underline">Edit</button>
                    <button onClick={() => toggleActive(a.id, !a.active)} className={\	ext-sm font-bold px-3 py-1 rounded-full \\}>
                      {a.active ? 'Hide' : 'Publish'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-black text-gray-900 text-lg">{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button onClick={closeForm}><X size={22} className="text-gray-400 hover:text-gray-900" /></button>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[var(--color-primary)] outline-none" placeholder="Announcement Title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[var(--color-primary)] outline-none bg-white">
                      <option>General</option>
                      <option>Masjid</option>
                      <option>Jumuah</option>
                      <option>Janaazah</option>
                      <option>Ramadan</option>
                      <option>Important</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[var(--color-primary)] outline-none bg-white">
                      <option>Normal</option>
                      <option>Important</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Message Details *</label>
                  <textarea required value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[var(--color-primary)] outline-none" placeholder="Enter announcement text..."></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2"><ImageIcon size={16}/> Image (Optional)</label>
                  
                  {existingImage && !file && (
                    <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
                      <img src={existingImage} alt="Current" className="max-h-40 object-contain rounded" />
                      <button type="button" onClick={() => setExistingImage(null)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"><Trash2 size={14}/></button>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">{file ? file.name : 'Upload new image (JPG/PNG)'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    {editingId ? 'Save Changes' : 'Publish Announcement'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
;

fs.writeFileSync('src/pages/admin/ManageAnnouncements.tsx', content);
