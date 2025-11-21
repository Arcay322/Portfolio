/**
 * Image Optimization Utilities
 * 
 * Helper functions for image processing and optimization
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Optimize image using sharp
 * @param inputPath - Path to input image
 * @param outputPath - Path to save optimized image
 * @param options - Optimization options
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: ImageOptimizationOptions = {}
): Promise<void> {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover',
  } = options;

  let pipeline = sharp(inputPath);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit });
  }

  // Convert format and compress
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
      break;
  }

  await pipeline.toFile(outputPath);
}

/**
 * Generate responsive image variants
 * @param inputPath - Path to input image
 * @param outputDir - Directory to save variants
 * @param baseName - Base name for output files
 */
export async function generateResponsiveImages(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<string[]> {
  const sizes = [
    { width: 640, suffix: 'sm' },
    { width: 768, suffix: 'md' },
    { width: 1024, suffix: 'lg' },
    { width: 1280, suffix: 'xl' },
    { width: 1920, suffix: '2xl' },
  ];

  const formats: Array<'webp' | 'avif'> = ['webp', 'avif'];
  const outputs: string[] = [];

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  for (const size of sizes) {
    for (const format of formats) {
      const outputPath = path.join(
        outputDir,
        `${baseName}-${size.suffix}.${format}`
      );
      
      await optimizeImage(inputPath, outputPath, {
        width: size.width,
        format,
        quality: 80,
      });
      
      outputs.push(outputPath);
    }
  }

  return outputs;
}

/**
 * Generate blur placeholder for image
 * @param inputPath - Path to input image
 * @returns Base64 encoded blur placeholder
 */
export async function generateBlurPlaceholder(inputPath: string): Promise<string> {
  const buffer = await sharp(inputPath)
    .resize(20, 20, { fit: 'inside' })
    .blur()
    .webp({ quality: 20 })
    .toBuffer();

  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

/**
 * Get image metadata
 * @param inputPath - Path to input image
 */
export async function getImageMetadata(inputPath: string) {
  const metadata = await sharp(inputPath).metadata();
  
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
    hasAlpha: metadata.hasAlpha,
  };
}

/**
 * Batch optimize images in directory
 * @param inputDir - Directory containing images to optimize
 * @param outputDir - Directory to save optimized images
 * @param options - Optimization options
 */
export async function batchOptimizeImages(
  inputDir: string,
  outputDir: string,
  options: ImageOptimizationOptions = {}
): Promise<void> {
  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  await fs.mkdir(outputDir, { recursive: true });

  const promises = imageFiles.map(async (file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      outputDir,
      file.replace(/\.(jpg|jpeg|png)$/i, `.${options.format || 'webp'}`)
    );

    await optimizeImage(inputPath, outputPath, options);
    console.log(`Optimized: ${file}`);
  });

  await Promise.all(promises);
  console.log(`Batch optimization complete. Processed ${imageFiles.length} images.`);
}

// Note: To use these utilities, install sharp:
// npm install sharp

// Usage example:
// import { optimizeImage, generateResponsiveImages } from '@/lib/image-optimization';
// 
// // Single image optimization
// await optimizeImage(
//   './public/images/hero.jpg',
//   './public/images/hero-optimized.webp',
//   { width: 1920, quality: 85, format: 'webp' }
// );
//
// // Generate responsive variants
// await generateResponsiveImages(
//   './public/images/hero.jpg',
//   './public/images/responsive',
//   'hero'
// );
