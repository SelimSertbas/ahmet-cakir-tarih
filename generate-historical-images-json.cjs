const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'lovable-uploads');
const outputFile = path.join(__dirname, 'src', 'historicalImages.json');

const files = fs.readdirSync(uploadsDir)
  .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
  .map(file => ({
    src: `/lovable-uploads/${file}`
  }));

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
console.log(`Found ${files.length} images. List written to src/historicalImages.json`); 