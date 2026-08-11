import sharp from "sharp";

export const optimizeImage = async (input) => {
    if (!Buffer.isBuffer(input) && typeof input !== "string") {
        throw new TypeError("optimizeImage expects a Buffer or a file path string input");
    }

    try {
        const optimizedBuffer = await sharp(input)
            .resize({
                width: 1600,
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