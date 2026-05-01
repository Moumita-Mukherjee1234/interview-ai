import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import BlacklistToken from "../models/Token.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ Check if token is blacklisted (logged out)
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;