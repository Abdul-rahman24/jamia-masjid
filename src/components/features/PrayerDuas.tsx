import { BookOpen } from 'lucide-react';

const DUAS = [
  {
    title: 'When hearing the Adhan',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transliteration: 'Allahumma Rabba hadhihi-dda`watit-tammah, was-salatil qa\'imah, aati Muhammadan al-waseelata wal-fadeelah, wab`ath-hu maqaman mahmoodan-il-ladhee wa`adtah.',
    translation: 'O Allah! Lord of this perfect call and of the regular prayer which is going to be established, give Muhammad the right of intercession and illustriousness, and resurrect him to the best and the highest place in Paradise that You promised him.',
  },
  {
    title: 'Entering the Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaf-tah liy abwaaba rahmatik.',
    translation: 'O Allah, open the doors of Your mercy for me.',
  },
  {
    title: 'Leaving the Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allahumma innee as\'aluka min fadlik.',
    translation: 'O Allah, I ask You from Your bounty.',
  }
];

export default function PrayerDuas() {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <BookOpen size={20} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Sunnah Supplications</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DUAS.map((dua, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {dua.title}
            </h3>
            <p className="text-xl leading-loose text-right text-[var(--color-primary)] font-bold mb-4 font-arabic" style={{ fontFamily: "'Amiri', serif" }}>
              {dua.arabic}
            </p>
            <p className="text-sm text-gray-500 italic mb-3">"{dua.transliteration}"</p>
            <p className="text-sm text-gray-700 mt-auto pt-4 border-t border-gray-50 border-dashed">
              {dua.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
