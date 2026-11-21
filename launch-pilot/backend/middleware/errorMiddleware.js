const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal server error";

    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((item) => item.message)
            .join(", ");
    }

    if (error.code === 11000) {
        statusCode = 409;
        message = "Email is already registered";
    }

    if (process.env.NODE_ENV !== "production") {
        console.error("Request Error:", error);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
    });
};

module.exports = {
    notFound,
    errorHandler
};
