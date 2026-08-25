// multipart/form-data (used by the blog publish/update routes for the cover
// image) can't carry a real array — the frontend sends it as a JSON-encoded
// string field instead. This turns that string back into an array/object
// before Joi validation runs, so the validation schema can stay a plain
// Joi.array() without knowing anything about multipart encoding.
const parseJsonField = (fieldName) => (req, res, next) => {
    const value = req.body?.[fieldName]

    if (typeof value === "string" && value.trim()) {
        try {
            req.body[fieldName] = JSON.parse(value)
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be valid JSON`
            })
        }
    }

    next()
}

export { parseJsonField }
