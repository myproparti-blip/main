import express from "express";
import { addCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

// ✅ GET all categories
router.get("/", getCategories);

// ✅ POST new category
router.post("/", addCategory);

export default router;
