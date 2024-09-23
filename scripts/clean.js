const fs = require('fs');
const path = require('path');
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) fs.rmdirSync( distDir, { recursive: true });