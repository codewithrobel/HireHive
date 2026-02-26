const fs = require('fs');
const path = require('path');

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

const REGEXES = [
    // Remove decorative glow divs completely by finding `<div className="absolute[^>]*blur[^>]*><\/div>` loosely
    { pattern: /<div[^>]*className="absolute[^>]*blur[^>]*>[^<]*<\/div>/g, replacement: '' },

    // Replace AI classes with standard clean classes
    { pattern: /bg-white\/[0-9]+/g, replacement: 'bg-white' },
    { pattern: /dark:bg-zinc-[0-9]+\/[0-9]+/g, replacement: 'dark:bg-zinc-900' },
    { pattern: /dark:bg-black\/[0-9]+/g, replacement: 'dark:bg-zinc-900' },
    { pattern: /dark:bg-white\/[0-9]+/g, replacement: 'dark:bg-zinc-800' },
    { pattern: /backdrop-blur-(sm|md|lg|xl|2xl|3xl)/g, replacement: '' },
    { pattern: /border-white\/[0-9]+/g, replacement: 'border-zinc-200 dark:border-zinc-800' },
    { pattern: /border-zinc-200 dark:border-white\/[0-9]+/g, replacement: 'border-zinc-200 dark:border-zinc-800' },

    { pattern: /shadow-\[0_[^\]]+\]/g, replacement: 'shadow-sm' },
    { pattern: /dark:shadow-\[0_[^\]]+\]/g, replacement: 'dark:shadow-none' },

    { pattern: /rounded-3xl/g, replacement: 'rounded-lg' },
    { pattern: /rounded-2xl/g, replacement: 'rounded-lg' },
    { pattern: /rounded-xl/g, replacement: 'rounded-md' },

    { pattern: /bg-clip-text text-transparent bg-gradient-to-r from-[^ ]+ via-[^ ]+ to-[^ ]+/g, replacement: 'text-zinc-900 dark:text-white' },
    { pattern: /bg-clip-text text-transparent bg-gradient-to-r from-[^ ]+ to-[^ ]+/g, replacement: 'text-zinc-900 dark:text-white' },
];

walkDir('frontend/src', function (filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.css')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    REGEXES.forEach(({ pattern, replacement }) => {
        content = content.replace(pattern, replacement);
    });

    // some cleanup for duplicate classes that might have been created by previous replacements
    content = content.replace(/bg-white bg-white/g, 'bg-white');
    content = content.replace(/dark:bg-zinc-900 dark:bg-zinc-900/g, 'dark:bg-zinc-900');
    content = content.replace(/border-zinc-200 dark:border-zinc-800 border-zinc-200 dark:border-zinc-800/g, 'border-zinc-200 dark:border-zinc-800');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
});
