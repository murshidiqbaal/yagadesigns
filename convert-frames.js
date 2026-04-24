import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const framesDir = path.join(process.cwd(), 'src/assets/frames');

async function convertToWebp() {
  try {
    const files = await fs.readdir(framesDir);
    const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

    console.log(`Found ${jpgFiles.length} JPG files. Starting conversion to WebP...`);

    let completed = 0;
    
    // Process in batches of 10 to avoid overwhelming memory
    const batchSize = 10;
    for (let i = 0; i < jpgFiles.length; i += batchSize) {
      const batch = jpgFiles.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (file) => {
        const inputPath = path.join(framesDir, file);
        const webpFilename = file.replace(/\.jpg$|\.jpeg$/i, '.webp');
        const outputPath = path.join(framesDir, webpFilename);

        await sharp(inputPath)
          .webp({ quality: 80 }) // Good quality but lightweight
          .toFile(outputPath);
        
        // Delete original JPG
        await fs.unlink(inputPath);
        
        completed++;
      }));
      console.log(`Converted ${completed}/${jpgFiles.length}`);
    }

    console.log('Successfully converted all frames to WebP and removed originals.');
  } catch (err) {
    console.error('Error during conversion:', err);
  }
}

convertToWebp();
