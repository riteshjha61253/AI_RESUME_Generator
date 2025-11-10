import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure upload folder exists
const uploadDir = "uploads/profile";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

export const uploadProfileImage = [
  upload.single("profile"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

const filePath = req.file.path.replace(/\\/g, "/"); // ✅ Convert \ to /
const imageUrl = `http://localhost:8080/${filePath}`;


    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl,
    });
  },
];
