import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createFullZip() {
  console.log('Building full cybernexus-full-code.zip...');
  const zip = new JSZip();
  const rootDir = process.cwd();

  function addDirToZip(currentDir, zipFolder) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (
        file === 'node_modules' ||
        file === '.git' ||
        file === 'dist' ||
        file === 'cybernexus-full-code.zip' ||
        file.endsWith('.log')
      ) {
        continue;
      }
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder ? zipFolder.folder(file) : zip.folder(file);
        addDirToZip(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        if (zipFolder) {
          zipFolder.file(file, content);
        } else {
          zip.file(file, content);
        }
      }
    }
  }

  addDirToZip(rootDir, zip);

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const zipContent = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const outPath = path.join(publicDir, 'cybernexus-full-code.zip');
  fs.writeFileSync(outPath, zipContent);
  console.log(`Saved full zip file to ${outPath} (${(zipContent.length / 1024 / 1024).toFixed(2)} MB)`);
}

createFullZip().catch(err => {
  console.error('Failed to create zip:', err);
  process.exit(1);
});
