import { useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, X, Trash2, Edit } from 'lucide-react';
import type { IslamicEvent } from '../../types';
import { useData } from '../../contexts/DataContext';

export default function ManageEvents() {
  const { islamicEvents, refresh } = useData();
  const [events, setEvents] = useState<IslamicEvent[]>(islamicEvents || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<IslamicEvent>>({
    name: '',
    date: '',
    description: '',
    color: 'bg-emerald-500'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.description) return;

    let updatedEvents;
    if (editingId) {
      updatedEvents = events.map(ev => 
        ev.id === editingId ? { ...ev, ...formData } as IslamicEvent : ev
      );
    } else {
      const newEvent: IslamicEvent = {
        ...formData,
        id: crypto.randomUUID()
      } as IslamicEvent;
      updatedEvents = [...events, newEvent];
    }

    setEvents(updatedEvents);
    await api.setIslamicEvents(updatedEvents);
    await refresh();
    
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', date: '', description: '', color: 'bg-emerald-500' });
  };

  const handleEdit = (ev: IslamicEvent) => {
    setEditingId(ev.id);
    setFormData(ev);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const updatedEvents = events.filter(ev => ev.id !== id);
    setEvents(updatedEvents);
    await api.setIslamicEvents(updatedEvents);
    await refresh();
  };

  const colors = [
    { label: 'Green', value: 'bg-emerald-500' },
    { label: 'Teal', value: 'bg-teal-600' },
    { label: 'Amber', value: 'bg-amber-500' },
    { label: 'Orange', value: 'bg-orange-500' },
    { label: 'Purple', value: 'bg-purple-600' },
    { label: 'Blue', value: 'bg-blue-500' },
    { label: 'Red', value: 'bg-red-500' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Upcoming Events</h1>
          <p className="text-gray-500 text-sm">Manage the Islamic Events timeline shown on the home page.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', date: '', description: '', color: 'bg-emerald-500' });
            setShowForm(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">
            No events added yet.
          </div>
        ) : (
          [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(ev => (
            <Card key={ev.id} className="overflow-hidden">
              <div className={`h-2 ${ev.color}`} />
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{ev.name}</h3>
                  <div className="text-sm text-gray-500 font-semibold mb-1">{new Date(ev.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <p className="text-gray-600">{ev.description}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(ev)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(ev.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="e.g., Ramadan Begins"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional info)</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  placeholder="e.g., 1 Ramadan 1448 AH"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color Theme</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.value })}
                      className={`w-8 h-8 rounded-full ${c.value} border-2 transition-all ${formData.color === c.value ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingId ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
