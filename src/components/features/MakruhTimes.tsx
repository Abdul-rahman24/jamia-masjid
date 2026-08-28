import { AlertOctagon } from 'lucide-react';

export default function MakruhTimes() {
  return (
    <div className="mt-8 bg-orange-50/50 rounded-3xl p-6 md:p-8 ring-1 ring-orange-100">
      <div className="flex items-center gap-3 mb-4">
        <AlertOctagon size={24} className="text-orange-500" />
        <h2 className="text-xl font-black text-gray-900">Makruh (Forbidden) Prayer Times</h2>
      </div>
      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        According to the Sunnah, it is strictly forbidden to offer any voluntary or make-up prayers during these three specific times of the day, as the sun is rising, setting, or exactly at its peak.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100/50">
          <h4 className="font-bold text-gray-900 text-sm mb-1">Sunrise</h4>
          <p className="text-xs text-gray-500">From the moment the sun begins to rise until it is fully above the horizon (approx. 15-20 mins).</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100/50">
          <h4 className="font-bold text-gray-900 text-sm mb-1">Zawal (Solar Noon)</h4>
          <p className="text-xs text-gray-500">When the sun is exactly at its highest point in the sky (zenith) until it slightly declines.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100/50">
          <h4 className="font-bold text-gray-900 text-sm mb-1">Sunset</h4>
          <p className="text-xs text-gray-500">From the moment the sun begins to set until it completely disappears below the horizon.</p>
        </div>
      </div>
    </div>
  );
}
