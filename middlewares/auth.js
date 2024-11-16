const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        const error = new Error("Access Denied: No Token Provided");
        error.status = 401;
        return next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const error = new Error("Invalid Token");
            error.status = 403;
            return next(error);
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
