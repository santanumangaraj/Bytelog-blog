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

    // Always log 500s — the previous "development"-only guard meant
    // production errors were sent to the client and then never logged
    // anywhere at all.
    if (statusCode === 500) {
        console.error("💥 Internal Server Error:", err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

export { errorHandler };

