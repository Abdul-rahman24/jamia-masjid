import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  }
});

const RAW_EVENTS = [
  { id: 'ev_mawlid_1448', name: 'Mawlid an-Nabi', date: '2026-09-04', description: '12 Rabi al-Awwal - Birth of the Prophet', color: 'bg-amber-500' },
  { id: 'ev_ramadan_1448', name: 'Ramadan Begins', date: '2027-02-18', description: '1 Ramadan 1448 AH', color: 'bg-violet-600' },
  { id: 'ev_qadr_1448', name: 'Laylat al-Qadr', date: '2027-03-14', description: '27 Ramadan - Night of Power', color: 'bg-purple-600' },
  { id: 'ev_fitr_1448', name: 'Eid al-Fitr', date: '2027-03-20', description: '1 Shawwal 1448 AH', color: 'bg-green-600' },
  { id: 'ev_adha_1448', name: 'Eid al-Adha', date: '2027-05-27', description: '10 Dhu al-Hijjah 1448 AH', color: 'bg-orange-500' },
  { id: 'ev_newyear_1449', name: 'Islamic New Year', date: '2027-06-05', description: '1 Muharram 1449 AH', color: 'bg-emerald-500' },
  { id: 'ev_ashura_1449', name: 'Ashura', date: '2027-06-15', description: '10 Muharram - Day of Fasting', color: 'bg-teal-600' }
];

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { error } = await supabase.from('site_settings').upsert({
    key: 'islamicEvents',
    value: RAW_EVENTS
  });
  if (error) {
    console.error('Error seeding events:', error);
  } else {
    console.log('Successfully seeded ' + RAW_EVENTS.length + ' upcoming Islamic events.');
  }
}
run();
