import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// 🔒 Protected route
router.get("/get-me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "User fetched successfully",
    user: req.user,
  });
});

export default router;