export const generateExcerpt = (content, maxLength = 200) => {
    const plainText = content.replace(/<[^>]*>/g, "").trim();

    if (plainText.length <= maxLength) {
        return plainText;
    }

    return `${plainText.substring(0, maxLength)}...`;
};