import { useState, useEffect } from 'react';
import { AlertCircle, Info, X } from 'lucide-react';
import type { Announcement } from '../../types';
import { useData } from '../../contexts/DataContext';

export default function AnnouncementBanner() {
  const { announcements } = useData();
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    const all = announcements;
    const now = new Date();
    
    const active = all.filter(a => {
      if (!a.active) return false;
      if (a.expiryDate && new Date(a.expiryDate) < now) return false;
      return true;
    }).sort((a, b) => {
      // Urgent first
      if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1;
      if (b.priority === 'Urgent' && a.priority !== 'Urgent') return 1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    setActiveAnnouncements(active);
  }, []);

  const visibleAnnouncements = activeAnnouncements.filter(a => !dismissedIds.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  // Show only the most important/recent one in the banner
  const announcement = visibleAnnouncements[0];

  const getColors = () => {
    switch (announcement.priority) {
      case 'Urgent': return 'bg-red-50 text-red-900 border-red-200';
      case 'Important': return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      default: return 'bg-blue-50 text-blue-900 border-blue-200';
    }
  };

  const getIcon = () => {
    switch (announcement.priority) {
      case 'Urgent': return <AlertCircle className="text-red-600 flex-shrink-0" size={20} />;
      case 'Important': return <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />;
      default: return <Info className="text-blue-600 flex-shrink-0" size={20} />;
    }
  };

  return (
    <div className={`border-b px-4 py-3 sm:px-6 lg:px-8 ${getColors()}`}>
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {getIcon()}
          <div>
            <span className="font-semibold">{announcement.title}: </span>
            <span className="text-sm sm:text-base">{announcement.description}</span>
          </div>
        </div>
        <button 
          onClick={() => setDismissedIds([...dismissedIds, announcement.id])}
          className="flex-shrink-0 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
