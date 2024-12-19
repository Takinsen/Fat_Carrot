const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZE_LIMIT = 70000; // File size limit in bytes (e.g., 70 KB)

async function compressImages(sourcePath, saveDirectory, mode = 'replace', checkMode = false) {
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

// Export the function
module.exports = compressImages;
