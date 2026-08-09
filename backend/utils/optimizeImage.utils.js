import sharp from "sharp";

export const optimizeImage = async (inputBuffer) => {
    if (!Buffer.isBuffer(inputBuffer)) {
        throw new TypeError("optimizeImage expects a Buffer input");
    }

    try {
        const optimizedBuffer = await sharp(inputBuffer)
            .resize({
                width: 1280,
                withoutEnlargement: true,
            })
            .webp({ quality: 80 })
            .toBuffer();

        return optimizedBuffer;
    } catch (err) {
        console.error("Sharp Error:", err);
        throw err;
    }
};