import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../services/mediaService.js"; // Adjust the path as necessary

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
    try {
      const result = await uploadMedia(req.file.path);
        return res.status(200).json({
        success: true,    
        message: "Video uploaded successfully",
        data: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        message: "Failed to upload video",
        });
    }
});

export default router;