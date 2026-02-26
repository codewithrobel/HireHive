const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const REGEXES = [
  { pattern: /<div className="absolute[^>]*blur[^>]*><\/div>/g, replacement: '' },
  { pattern: /<div className="absolute[^>]*radial-gradient[^>]*><\/div>/g, replacement: '' },
  { pattern: /backdrop-blur-(xl|2xl|3xl|md|lg|sm)/g, replacement: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800' },
  { pattern: /bg-white\/(60|70|80|50|40)/g, replacement: 'bg-white' },
  { pattern: /dark:bg-zinc-900\/50/g, replacement: 'dark:bg-zinc-900' },
  { pattern: /dark:bg-zinc-950\/70/g, replacement: 'dark:bg-zinc-900' },
  { pattern: /dark:bg-black\/(20|30|40)/g, replacement: 'dark:bg-zinc-800' },
  { pattern: /dark:bg-white\/(5|10)/g, replacement: 'dark:bg-zinc-800' },
  { pattern: /border-white\/(10|20|60|80)/g, replacement: 'border-zinc-200 dark:border-zinc-800' },
  { pattern: /rounded-3xl|rounded-2xl|rounded-xl/g, replacement: 'rounded-lg' },
  { pattern: /shadow-\[0_[^\]]+\]/g, replacement: 'shadow-sm' },
  { pattern: /bg-clip-text text-transparent bg-gradient-to-r[^" ]+/g, replacement: 'text-zinc-900 dark:text-white' },
  { pattern: /bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100/g, replacement: '' },
  { pattern: /<div className="absolute inset-0  transition-opacity duration-300"><\/div>/g, replacement: '' },
  { pattern: /shadow-blue-500\/[0-9]+/g, replacement: 'shadow-sm' },
  { pattern: /shadow-purple-500\/[0-9]+/g, replacement: '' },
  { pattern: /bg-blue-500\/[0-9]+/g, replacement: 'bg-blue-100 dark:bg-blue-900/40' },
  { pattern: /bg-purple-500\/[0-9]+/g, replacement: 'bg-purple-100 dark:bg-purple-900/40' },
  { pattern: /border-blue-500\/[0-9]+/g, replacement: 'border-blue-200 dark:border-blue-800' },
  { pattern: /drop-shadow-\[0_[^\]]+\]/g, replacement: 'drop-shadow-sm' }
];

walkDir('frontend/src', function (filePath) {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.css')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  REGEXES.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
});
