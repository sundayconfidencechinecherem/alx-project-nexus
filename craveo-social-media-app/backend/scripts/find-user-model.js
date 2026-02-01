// backend/scripts/find-user-model.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Looking for user.model.ts...\n');

// Search recursively from current directory
function findUserModel(dir, depth = 0) {
  if (depth > 5) return; // Limit depth
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findUserModel(fullPath, depth + 1);
    } else if (file === 'user.model.ts' || file === 'User.model.ts') {
      console.log('✅ Found:', fullPath);
      console.log('   Relative path from scripts directory:', path.relative(__dirname, fullPath));
    }
  }
}

findUserModel(path.join(__dirname, '..'));