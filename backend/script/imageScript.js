import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary'
import { fileURLToPath } from 'url';
import allfood from '../model/foodData.js';
import typefood from '../model/foodType.js';

export const getAllImageUrls = async()=>{
    let allImages = [];
    let nextCursor = null;
    try {
        do {
          // Fetch image resources from Cloudinary
          const result = await cloudinary.api.resources({
            type: 'upload',  // Only 'upload' resources (images, videos, etc.)
            max_results: 500,  // Max number of results per request
            next_cursor: nextCursor,  // Pagination cursor if there are more images
          });
    
          allImages = allImages.concat(result.resources);  // Add current batch of images
          nextCursor = result.next_cursor;  // Get the cursor for the next batch
        } while (nextCursor);  // Continue if there are more images
    
        return allImages;  // Return all image URLs
      } catch (error) {
        console.error('Error fetching images:', error);
        return [];
      }
}

export const getPublicId = (url) => {
    const filePath = path.basename(url , path.extname(url));
    const publicID = url.split('/upload/')[1]?.split('/').slice(1, -1).join('/');
    return publicID ? `${publicID}/${filePath}` : filePath;
};

export const uploadToCloudinary = (fileBuffer , folderName) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: folderName }, // Cloudinary options
        (error, result) => {
          if (error) return reject(error); // Reject promise on error
          resolve(result); // Resolve promise with the upload result
        }
      );
      stream.end(fileBuffer); // Send file buffer to Cloudinary
    });
  };

export const compressImages = async(sourcePath, saveDirectory, mode = 'replace', checkMode = false) => {
    const SIZE_LIMIT = 70000; // File size limit in bytes (e.g., 70 KB)
    try {
        const isDirectory = fs.lstatSync(sourcePath).isDirectory();

        if (mode === 'save' && !fs.existsSync(saveDirectory)) {
            throw new Error(`Save directory not found: ${saveDirectory}`);
        }

        const processFile = async (filePath, fileName) => {
            const extname = path.extname(fileName).toLowerCase();
            if (/\.(jpg|jpeg|png|gif)$/i.test(extname)) {
                const stats = fs.statSync(filePath);

                if (stats.size > SIZE_LIMIT) {
                    const outputFilePath = mode === 'save'
                        ? path.join(saveDirectory, fileName)
                        : `${filePath}-temp${extname}`;

                    if (checkMode && mode === 'save' && fs.existsSync(outputFilePath)) {
                        console.log(`Skipped compression for ${fileName}, already exists in save directory.`);
                        return;
                    }

                    console.log(`Compressing ${fileName} (Size: ${stats.size} bytes)`);

                    if (extname === '.jpg' || extname === '.jpeg') {
                        await sharp(filePath)
                            .resize(700, 700, { fit: 'inside' })
                            .withMetadata()
                            .jpeg({ quality: 70 })
                            .toFile(outputFilePath);
                    } else if (extname === '.png') {
                        await sharp(filePath)
                            .resize(700, 700, { fit: 'inside' })
                            .withMetadata()
                            .png({ quality: 70 })
                            .toFile(outputFilePath);
                    } else if (extname === '.gif') {
                        await sharp(filePath)
                            .resize(700, 700, { fit: 'inside' })
                            .withMetadata()
                            .gif({ quality: 70 })
                            .toFile(outputFilePath);
                    }

                    if (mode === 'replace') {
                        fs.renameSync(outputFilePath, filePath);
                    }

                    console.log(`Compressed ${fileName} to under ${SIZE_LIMIT / 1000} KB`);
                }
            }
        };

        if (isDirectory) {
            const files = fs.readdirSync(sourcePath);
            for (const file of files) {
                await processFile(path.join(sourcePath, file), file);
            }
        } else {
            const fileName = path.basename(sourcePath);
            await processFile(sourcePath, fileName);
        }
    } catch (error) {
        console.error("Error processing images:", error);
    }
}