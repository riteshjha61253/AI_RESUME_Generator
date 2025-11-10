import express from "express";
import { uploadProfileImage } from "../controller/uploadController.js";

const router = express.Router();
router.post("/profile", uploadProfileImage);

export default router;
