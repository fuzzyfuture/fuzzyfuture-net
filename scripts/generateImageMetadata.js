import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '../raw-images');
const rawSubDir = 'raw';
const outputFile = path.join(__dirname, '../src/data/imageMetadata.json');
const bucketUrl = 'https://s3.us-east-2.amazonaws.com/fuzzyfuture.net';

const generateImageMetadata = async () => {
  const metadata = {};
  const folders = fs.readdirSync(baseDir);

  for (const folder of folders) {
    const rawFolderPath = path.join(baseDir, folder, rawSubDir);

    if (fs.existsSync(rawFolderPath) && fs.lstatSync(rawFolderPath).isDirectory()) {
      metadata[folder] = [];

      const files = fs.readdirSync(rawFolderPath).filter((file) => /\.(jpg|png|gif)$/i.test(file));
      for (const file of files) {
        const s3Url = `${bucketUrl}/scans/${folder}/web/${file}`;
        metadata[folder].push(s3Url);
      }
    } else {
      console.warn(`Web folder not found for: ${folder}`);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(metadata, null, 2));
  console.log(`Image metadata generated: ${outputFile}`);
};

generateImageMetadata().catch(console.error);