import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import type { PrayerTime } from '../../types';

export default function ManagePrayers() {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPrayers(api.getPrayerTimes());
  }, []);

  const handleChange = (index: number, field: keyof PrayerTime, value: string) => {
    const newPrayers = [...prayers];
    newPrayers[index] = { ...newPrayers[index], [field]: value };
    setPrayers(newPrayers);
  };

  const handleSave = () => {
    setIsSaving(true);
    api.setPrayerTimes(prayers);
    setTimeout(() => setIsSaving(false), 500); // Fake delay for UX
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Prayer Times</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600">Prayer</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Adhan / Start (HH:mm)</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Jama'ah (HH:mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prayers.map((prayer, index) => (
                <tr key={prayer.name}>
                  <td className="py-4 px-6 font-bold text-gray-900">{prayer.name}</td>
                  <td className="py-4 px-6">
                    <input 
                      type="time" 
                      value={prayer.adhan} 
                      onChange={(e) => handleChange(index, 'adhan', e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm p-2 border focus:border-[var(--color-primary)] focus:ring-0"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="time" 
                      value={prayer.iqamah || ''} 
                      onChange={(e) => handleChange(index, 'iqamah', e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm p-2 border focus:border-[var(--color-primary)] focus:ring-0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <p className="text-sm text-gray-500 mt-4">
        Note: Use 24-hour format (e.g., 14:30 for 2:30 PM). Leave Jama'ah empty if not applicable.
      </p>
    </div>
  );
}

