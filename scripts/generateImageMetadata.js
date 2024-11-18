import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '../raw-images');
const outputFile = path.join(__dirname, '../src/data/imageMetadata.json');
const bucketUrl = 'https://s3.us-east-2.amazonaws.com/fuzzyfuture.net';

const generateImageMetadata = () => {
  const metadata = {};
  const folders = fs.readdirSync(baseDir);

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder, 'web');

    if (fs.lstatSync(folderPath).isDirectory()) {
      metadata[folder] = [];

      const files = fs.readdirSync(folderPath).filter((file) => /\.(jpg|png|gif)$/i.test(file));
      for (const file of files) {
        const s3Url = `${bucketUrl}/scans/${folder}/web/${file}`;
        metadata[folder].push(s3Url);
      }
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(metadata, null, 2));
  console.log(`Image metadata generated: ${outputFile}`);
};

generateImageMetadata();
