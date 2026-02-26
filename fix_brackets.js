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

    // Fix orphaned `}` caused by greedy regex leaving one bracket behind inside JSX tags
    content = content.replace(/<\w+(?:\s|\\n)*\}[\s\S]*?className/g, (match) => {
        return match.replace(/\}/g, '');
    });

    // Also clean up any AnimatePresence tags left over
    content = content.replace(/<AnimatePresence[^>]*>\s*/g, '');
    content = content.replace(/<\/AnimatePresence>\s*/g, '');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed brackets: ${filePath}`);
    }
});
