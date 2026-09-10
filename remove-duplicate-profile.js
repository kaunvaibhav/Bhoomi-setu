const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/suraj/OneDrive/Documents/GitHub/Bhoomi-setu/app/dashboard');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  const regex = /<div className=\"flex items-center gap-2\">\s*<div className=\"hidden sm:flex items-center gap-2 bg-\[#EAF0F8\][\s\S]*?<span className=\"hidden sm:inline\">Sign Out<\/span>\s*<\/button>\s*<\/div>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log('Modified ' + count + ' files.');
