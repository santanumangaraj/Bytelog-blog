const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // Handle Sequelize validation errors
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        statusCode = 400;
        message = err.errors ? err.errors.map(e => e.message).join(", ") : err.message;
        errors = err.errors ? err.errors.map(e => ({ field: e.path, message: e.message })) : [];
    }

    if (process.env.NODE_ENV === "development" && statusCode === 500) {
        console.error("💥 Internal Server Error Stack:", err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

export { errorHandler };

