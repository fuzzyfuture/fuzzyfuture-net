import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/img/myspace');
const outputFile = path.join(__dirname, '../src/data/myspaceImages.json');
const relativeBasePath = '/img/myspace';

const generateImageUrls = async () => {
  const imageUrls = [];
  const files = fs.readdirSync(inputDir).filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

  for (const file of files) {
    const relativeUrl = `${relativeBasePath}/${file}`;
    imageUrls.push(relativeUrl);
  }

  fs.writeFileSync(outputFile, JSON.stringify(imageUrls, null, 2));
  console.log(`Image URLs JSON generated at: ${outputFile}`);
};

generateImageUrls().catch(console.error);
