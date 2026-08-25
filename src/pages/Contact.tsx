import { Card, CardContent } from '../components/ui/Card';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Contact() {
  const { contacts } = useData();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Management</h1>
        <p className="text-gray-600 text-lg">Get in touch with the Masjid committee.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contacts.map(c => (
          <Card key={c.id}>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{c.name}</h2>
              <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-6">{c.role}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <a href={`tel:${c.phone}`} className="font-semibold text-gray-900 hover:text-[var(--color-primary)]">{c.phone}</a>
                  </div>
                </div>

                {c.whatsapp && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">WhatsApp</p>
                      <a href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 hover:text-green-600">{c.whatsapp}</a>
                    </div>
                  </div>
                )}

                {c.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <a href={`mailto:${c.email}`} className="font-semibold text-gray-900 hover:text-blue-600">{c.email}</a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
