import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent } from '../components/ui/Card';
import { format } from 'date-fns';
import { Megaphone, X } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

export default function Announcements() {
  const { announcements } = useData();
  const { lang: language } = useLang();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const activeAnnouncements = announcements.filter(a => a.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
          <Megaphone className="text-[var(--color-primary)]" size={32} />
          {language === 'ta' ? 'அறிவிப்புகள்' : 'Announcements'}
        </h1>
        <p className="text-gray-500 text-lg">
          {language === 'ta' ? 'பள்ளிவாசலில் இருந்து சமீபத்திய செய்திகள் மற்றும் அறிவிப்புகள்' : 'Latest news and announcements from the Masjid'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeAnnouncements.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No active announcements at this time.</p>
          </div>
        ) : (
          [...activeAnnouncements].reverse().map(a => {
            let descText = a.description;
            let img = null;
            try {
              const parsed = JSON.parse(a.description);
              descText = parsed.text;
              img = parsed.image;
            } catch(e) {}

            return (
              <Card key={a.id} className={`overflow-hidden hover:shadow-xl transition-shadow border-t-4 ${a.priority === 'Urgent' ? 'border-t-red-500' : a.priority === 'Important' ? 'border-t-orange-500' : 'border-t-[var(--color-primary)]'}`}>
                {img && (
                  <div 
                    className="w-full h-48 bg-gray-100 overflow-hidden border-b border-gray-100 cursor-pointer relative group"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-bold bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-opacity">View Image</span>
                    </div>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{a.category}</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {format(new Date(a.publishedDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl leading-tight mb-3">{a.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{descText}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2">
            <X size={28} />
          </button>
          <img 
            src={selectedImage} 
            alt="Announcement Full View" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
