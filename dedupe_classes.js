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

walkDir('frontend/src', function (filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.css')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Find className strings and remove duplicate tailwind classes within them
    content = content.replace(/className=(["'])(.*?)(["'])/g, (match, openQuote, classString, closeQuote) => {
        let classes = classString.split(/\s+/).filter(c => c.length > 0);
        let uniqueClasses = [...new Set(classes)];
        return `className=${openQuote}${uniqueClasses.join(' ')}${closeQuote}`;
    });

    // also handle template literals className={`...`} loosely
    content = content.replace(/className=\{`([^`]+)`\}/g, (match, classString) => {
        // Note: this might mess up conditional logic if not careful, e.g. ${cond ? 'a' : 'b'}
        // To be safe, let's only do straightforward duplicate class replacements globally
        return match;
    });

    // Global simple duplicate replacements just in case
    content = content.replace(/border-zinc-200 dark:border-zinc-200 dark:border-zinc-800/g, 'border-zinc-200 dark:border-zinc-800');
    content = content.replace(/bg-white dark:bg-zinc-800 bg-white dark:bg-zinc-900/g, 'bg-white dark:bg-zinc-900');
    content = content.replace(/border-white dark:border-white\/5/g, 'border-zinc-200 dark:border-zinc-800');
    content = content.replace(/shadow-sm dark:shadow-sm/g, 'shadow-sm');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Deduped: ${filePath}`);
    }
});
