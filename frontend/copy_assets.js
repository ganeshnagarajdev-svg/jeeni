
const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\Ganesh\\.gemini\\antigravity\\brain\\ee914c3b-def6-4a34-812f-33ac40adbc94';
const destDir = 'c:\\Users\\Ganesh\\Desktop\\Jeeni\\frontend\\public\\assets\\images';

const files = [
    { src: 'hero_bowl_1769427991245.png', dest: 'hero-bowl.png' },
    { src: 'cat_cookies_1769428008016.png', dest: 'cat-cookies.png' },
    { src: 'cat_adult_1769428024082.png', dest: 'cat-adult.png' },
    { src: 'cat_kids_1769428086488.png', dest: 'cat-kids.png' },
    { src: 'cat_slim_1769428102973.png', dest: 'cat-slim.png' },
    { src: 'cat_ready_1769428121963.png', dest: 'cat-ready.png' },
    { src: 'hero_bg_1769428138967.png', dest: 'hero-bg.png' },
    { src: 'pattern_bg_1769428157548.png', dest: 'pattern-bg.png' }
];

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
    const srcPath = path.join(sourceDir, file.src);
    const destPath = path.join(destDir, file.dest);
    
    try {
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${file.src} to ${file.dest}`);
        } else {
            console.error(`Source file not found: ${srcPath}`);
        }
    } catch (err) {
        console.error(`Error copying ${file.src}: ${err.message}`);
    }
});
