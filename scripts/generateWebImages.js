import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '../raw-images');
const rawSubDir = 'raw';
const webSubDir = 'web';
const webImageWidth = 1200;
const webImageQuality = 80;

const generateWebImages = async () => {
  const folders = fs.readdirSync(baseDir);

  for (const folder of folders) {
    const rawFolderPath = path.join(baseDir, folder, rawSubDir);
    const webFolderPath = path.join(baseDir, folder, webSubDir);

    if (fs.existsSync(rawFolderPath) && fs.lstatSync(rawFolderPath).isDirectory()) {
      if (!fs.existsSync(webFolderPath)) {
        fs.mkdirSync(webFolderPath, { recursive: true });
      }

      const files = fs.readdirSync(rawFolderPath).filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
      for (const file of files) {
        const inputFile = path.join(rawFolderPath, file);
        const outputFile = path.join(webFolderPath, `${path.parse(file).name}.jpg`);

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
    } else {
      console.warn(`Raw folder not found for: ${folder}`);
    }
  }

  console.log('Web image generation complete.');
};

generateWebImages().catch(console.error);
