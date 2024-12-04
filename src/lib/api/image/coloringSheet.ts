import sharp from 'sharp';
import potrace from 'potrace';
import { promisify } from 'util';

const trace = promisify(potrace.trace);

export async function createColoringSheet(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Convert image to grayscale and adjust contrast
    const processedImage = await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .threshold(128)
      .toBuffer();

    // Convert to SVG using potrace
    const svg = await trace(processedImage, {
      turdSize: 100,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      alphaMax: 1,
      optCurve: true,
      optTolerance: 0.2,
      threshold: 128,
      blackOnWhite: true,
      background: '#ffffff',
    });

    // Convert SVG back to PNG
    const finalImage = await sharp(Buffer.from(svg))
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    return finalImage;
  } catch (error) {
    console.error('Error creating coloring sheet:', error);
    throw error;
  }
}