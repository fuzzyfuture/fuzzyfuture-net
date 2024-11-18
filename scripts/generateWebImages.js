import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawImagesDir = path.join(__dirname, '../raw-images');
const outputSubDir = 'web';
const webImageWidth = 1200;
const webImageQuality = 80;

const generateWebImages = async () => {
  const folders = fs.readdirSync(rawImagesDir);

  for (const folder of folders) {
    const folderPath = path.join(rawImagesDir, folder);
    const outputFolder = path.join(folderPath, outputSubDir);

    if (fs.lstatSync(folderPath).isDirectory()) {
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }

      const files = fs.readdirSync(folderPath).filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
      for (const file of files) {
        const inputFile = path.join(folderPath, file);
        const outputFile = path.join(outputFolder, `${path.parse(file).name}.jpg`);

        if (fs.existsSync(outputFile)) {
          console.log(`Web version already exists for: ${file}`);
          continue;
        }

        try {
          await sharp(inputFile)
            .resize({ width: webImageWidth })
            .jpeg({ quality: webImageQuality })
            .toFile(outputFile);
          console.log(`Generated web-optimized image for: ${file}`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }
  }

  console.log('Web image generation complete.');
};

generateWebImages().catch(console.error);
