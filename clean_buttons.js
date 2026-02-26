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
    if (!filePath.endsWith('.jsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Clean button classes that got messed up in previous replace
    content = content.replace(/border border-blue-600(.*?)border border-blue-200 dark:border-blue-500\/50/g, 'border border-blue-200 dark:border-blue-500/50$1');
    content = content.replace(/bg-blue-50(.*?)bg-white/g, 'bg-white$1');
    content = content.replace(/hover:shadow-sm dark:hover:shadow-sm/g, '');
    content = content.replace(/shadow-sm dark:shadow-sm/g, 'shadow-sm');
    content = content.replace(/bg-blue-50(.*?)bg-blue-50/g, 'bg-blue-50$1');
    content = content.replace(/border border-blue-600(.*?)border border-blue-200/g, 'border border-blue-200$1');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned buttons: ${filePath}`);
    }
});
