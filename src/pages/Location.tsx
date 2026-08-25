import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { MapPin, Navigation, Copy } from 'lucide-react';
import { useState } from 'react';

export default function Location() {
  const loc = api.getLocationInfo();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(loc.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Location</h1>
        <p className="text-gray-600 text-lg">Visit us at {loc.name}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-64 bg-gray-200 relative w-full flex items-center justify-center">
          {/* Map Placeholder */}
          <div className="text-gray-500 text-center">
            <MapPin size={48} className="mx-auto mb-2 opacity-50" />
            <p className="font-medium">Map Integration Placeholder</p>
            <p className="text-sm">Configured Link: {loc.mapsLink}</p>
          </div>
        </div>
        
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{loc.name}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-2 max-w-md">
                {loc.address}
              </p>
              {loc.landmark && (
                <p className="text-sm text-gray-500 font-medium">
                  Landmark: {loc.landmark}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <a 
                href={loc.mapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-light)] transition-colors flex items-center justify-center gap-2"
              >
                <Navigation size={20} /> Get Directions
              </a>
              <button 
                onClick={copyAddress}
                className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={20} /> {copied ? 'Copied!' : 'Copy Address'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
