const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv")
dotenv.config();


const authMiddleware = async(req, res, next) => {

    const token = req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : undefined;

    if (!token) {
        return res.status(401).json({ message: "Token not provided..." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = authMiddleware;