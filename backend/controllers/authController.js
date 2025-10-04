import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const sendOtp = async (req, res) => {
  try {
    const { phone, role } = req.body;
    if (!phone || !role)
      return res.status(400).json({ message: "Phone & role required" });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    let user = await User.findOne({ phone });

    if (!user) user = await User.create({ phone, role });

    if (user.isDeleted) user.isDeleted = false;

    user.otp = { code: otpCode, expiresAt: Date.now() + 2 * 60 * 1000 };
    await user.save();

    console.log(`OTP for ${phone}: ${otpCode}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔸 2. Verify OTP → Login
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !user.otp)
      return res.status(400).json({ message: "Invalid request" });

    if (user.otp.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (user.otp.code !== otp)
      return res.status(400).json({ message: "Incorrect OTP" });

    user.otp = undefined;
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token missing" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user._id);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired, please log in again" });
    }
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const profile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isDeleted = true;
    user.refreshToken = null;
    await user.save();

    res.json({ success: true, message: "Account deleted. Login required next time." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
