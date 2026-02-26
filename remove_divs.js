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

    // Remove the complex gradient group hover divs completely
    content = content.replace(/<div className="absolute inset-0 bg-gradient-[^>]*><\/div>\s*/g, '');

    // Update button classes that had the gradient effect to be standard blue hover
    content = content.replace(/className="([^"]*)relative group overflow-hidden([^"]*)"/g, (match, before, after) => {
        return `className="${before}hover:bg-blue-600 hover:text-white transition-colors border border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-100${after}"`;
    });

    // also fix some ugly left over rounded-md inside large areas
    content = content.replace(/rounded-md/g, 'rounded');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated gradients: ${filePath}`);
    }
});
