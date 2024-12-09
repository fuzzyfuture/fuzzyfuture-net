import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '../raw-images');
const rawSubDir = 'raw';
const webSubDir = 'web';
const outputFile = path.join(__dirname, '../src/data/imageMetadata.json');
const bucketUrl = 'https://s3.us-east-2.amazonaws.com/fuzzyfuture.net';

const generateImageMetadata = async () => {
  const metadata = {};
  const folders = fs.readdirSync(baseDir);

  for (const folder of folders) {
    const folderMetadata = {
      raw: [],
      web: [],
    };

    const rawFolderPath = path.join(baseDir, folder, rawSubDir);

    if (fs.existsSync(rawFolderPath) && fs.lstatSync(rawFolderPath).isDirectory()) {
      const rawFiles = fs.readdirSync(rawFolderPath).filter((file) => /\.(jpg|png|gif)$/i.test(file));

      for (const file of rawFiles) {
        const rawS3Url = `${bucketUrl}/scans/${folder}/raw/${file}`;
        folderMetadata.raw.push(rawS3Url);
      }
    } else {
      console.warn(`Raw folder not found for: ${folder}`);
    }

    const webFolderPath = path.join(baseDir, folder, webSubDir);

    if (fs.existsSync(webFolderPath) && fs.lstatSync(webFolderPath).isDirectory()) {
      const webFiles = fs.readdirSync(webFolderPath).filter((file) => /\.(jpg|png|gif)$/i.test(file));

      for (const file of webFiles) {
        const webS3Url = `${bucketUrl}/scans/${folder}/web/${file}`;
        folderMetadata.web.push(webS3Url);
      }
    } else {
      console.warn(`Web folder not found for: ${folder}`);
    }

    metadata[folder] = folderMetadata;
  }

  fs.writeFileSync(outputFile, JSON.stringify(metadata, null, 2));
  console.log(`Image metadata generated: ${outputFile}`);
};

generateImageMetadata().catch(console.error);