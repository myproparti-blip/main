import express from "express";
import {
  sendOtp,
  verifyOtp,
  profile,
  refreshAccessToken,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", protect, profile);
router.delete("/delete-account", protect, deleteAccount);
export default router;
