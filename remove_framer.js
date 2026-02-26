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

    // Remove framer-motion imports
    content = content.replace(/import \{ motion[^}]*\} from 'framer-motion';\n/g, '');

    // Replace motion.div with normal div
    content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
    content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');

    // Remove motion props (initial, animate, exit, transition, whileHover, whileTap, viewport, variants)
    content = content.replace(/ (initial|animate|exit|transition|whileHover|whileTap|viewport|variants)=\{[^}]+\}/g, '');
    content = content.replace(/ (initial|animate|exit|transition|whileHover|whileTap|viewport|variants)={([^}]*)}/g, '');
    // sometimes there are newlines between the braces
    content = content.replace(/ (initial|animate|exit|transition|whileHover|whileTap|viewport|variants)=\{[\s\S]*?\}/g, '');

    // Clean empty AnimatePresence
    content = content.replace(/<AnimatePresence[^>]*>/g, '');
    content = content.replace(/<\/AnimatePresence>/g, '');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed framer-motion: ${filePath}`);
    }
});
