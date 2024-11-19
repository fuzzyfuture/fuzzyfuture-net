import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawImagesDir = path.join(__dirname, '../raw-images');
const thumbsDir = path.join(__dirname, '../public/img/thumbs');
const rawSubDir = 'raw';
const thumbnailWidth = 100;
const thumbnailQuality = 80;

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const generateThumbnails = async () => {
  const folders = fs.readdirSync(rawImagesDir);

  for (const folder of folders) {
    const rawFolderPath = path.join(rawImagesDir, folder, rawSubDir);
    const outputFolder = path.join(thumbsDir, folder);

    if (fs.existsSync(rawFolderPath) && fs.lstatSync(rawFolderPath).isDirectory()) {
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }

      const files = fs.readdirSync(rawFolderPath).filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
      for (const file of files) {
        const inputFile = path.join(rawFolderPath, file);
        const outputFile = path.join(outputFolder, `${path.parse(file).name}.jpg`);

        if (fs.existsSync(outputFile)) {
          console.log(`Thumbnail already exists for: ${file}`);
          continue;
        }

        try {
          await sharp(inputFile)
            .resize({ width: thumbnailWidth })
            .jpeg({ quality: thumbnailQuality })
            .toFile(outputFile);
          console.log(`Generated thumbnail for: ${file}`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    } else {
      console.warn(`Raw folder not found for: ${folder}`);
    }
  }

  console.log('Thumbnails generation complete.');
};

generateThumbnails().catch(console.error);