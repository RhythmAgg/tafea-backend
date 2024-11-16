const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: {
            message,
        },
    });

    console.error(`[Error]: ${message}`);
};

module.exports = errorHandler;