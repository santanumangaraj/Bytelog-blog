import sharp from "sharp";

export const optimizeImage = async (inputPath, outputPath) => {
    return sharp(inputPath)
        .resize({
            width: 1280,
            withoutEnlargement: true,
        })
        .webp({
            quality: 80,
        })
        .toFile(outputPath);
};