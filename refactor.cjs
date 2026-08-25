const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mapping = {
  'api.getPrayerTimes()': 'prayerTimes',
  'api.getAnnouncements()': 'announcements',
  'api.getJanaazah()': 'janaazah',
  'api.getMasjidInfo()': 'masjidInfo',
  'api.getJumuahInfo()': 'jumuahInfo',
  'api.getLocationInfo()': 'locationInfo',
  'api.getContacts()': 'contacts',
  'api.getDonationInfo()': 'donationInfo',
  'api.getNikahInfo()': 'nikahInfo',
  'api.getResources()': 'resources',
  'api.getRentalRequests()': 'rentalRequests',
  'api.getJanaazahSubmissions()': 'janaazahSubmissions',
  'api.getNikahSubmissions()': 'nikahSubmissions'
};

function processFile(filePath) {
  if (filePath.includes('DataContext.tsx') || filePath.includes('Home.tsx') || filePath.includes('MainLayout.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('api.get')) return;

  const importsToInject = [];
  
  // Find which ones are used
  const usedProps = new Set();
  for (const [key, val] of Object.entries(mapping)) {
    if (content.includes(key)) {
      usedProps.add(val);
      // Replace all occurrences of const var = api.getX(); with nothing, or just replace api.getX() with the variable
      content = content.split(key).join(val);
    }
  }

  if (usedProps.size > 0) {
    // Add useData to the component
    // We need to inject `const { a, b, c } = useData();` inside the component
    const componentRegex = /export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*\{/g;
    content = content.replace(componentRegex, (match) => {
      return match + `\n  const { ${Array.from(usedProps).join(', ')} } = useData();`;
    });

    // Add import for useData
    const relativeDepth = filePath.split(path.sep).length - srcDir.split(path.sep).length - 1;
    const dots = relativeDepth > 0 ? '../'.repeat(relativeDepth) : './';
    const importStr = `import { useData } from '${dots}contexts/DataContext';\n`;
    
    // Find last import
    const lastImportIndex = content.lastIndexOf('import ');
    const newlineAfterImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, newlineAfterImport + 1) + importStr + content.slice(newlineAfterImport + 1);

    // If 'import { api }' is no longer used, we should remove it, but let's keep it safe.
    // If it's used for api.addX or api.setX or api.updateX, we need it.
    if (!content.includes('api.')) {
      content = content.replace(/import\s*\{\s*api\s*\}\s*from\s*['"][^'"]+['"];?\n?/, '');
    }

    // Clean up empty assignments like `const prayerTimes = prayerTimes;`
    for (const prop of usedProps) {
      const regex = new RegExp(`const\\s+${prop}\\s*=\\s*${prop};?\\n?`, 'g');
      content = content.replace(regex, '');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Processed', filePath);
  }
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir(srcDir, processFile);
