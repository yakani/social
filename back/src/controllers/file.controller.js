import asyncHandler from "express-async-handler";
import cloudinary from "../lib/cloudinary.js";
import File from "../models/file.model.js";
import { moderateMedia } from "../lib/Moderation.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import { io } from "../lib/socket.js";
import fs from 'fs';
import path from 'path';

const createFile = asyncHandler(async (req, res) => {
  const { prompt, title } = req.body;
  let fileurl = null;
  let thumbnailUrl = null;
  let tmpPath = null;
  
  // Validate required fields
  if (!req.files?.file?.[0]) {
    return res.status(400).json({ message: "No file provided" });
  }
  
  const file = req.files.file[0];
  let duration = 0;

  try {
    // Handle video duration calculation
    if (file?.mimetype.startsWith("video/")) {
      // Create temp directory if it doesn't exist
      const tmpDir = './tmp';
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      // Create proper file path (not directory)
      tmpPath = path.join(tmpDir, `${Date.now()}_${file.originalname}`);
      
      try {
        await fs.promises.writeFile(tmpPath, file.buffer);
        duration = await getVideoDurationInSeconds(tmpPath);
      } catch (error) {
        console.error("Error processing video duration:", error);
        throw new Error("Failed to process video file");
      }
    }

    // Content moderation
    let moderationResult;
    try {
      moderationResult = await moderateMedia(
        file.buffer,
        file.originalname,
        file.mimetype,
        process.env.SIGHTENGINE_USER_ID,
        process.env.SIGHTENGINE_API_SECRET,
        duration
      );
    } catch (error) {
      console.error("Moderation error:", error);
      return res.status(500).json({ message: "Content moderation failed" });
    }

    // Check moderation result
    if (moderationResult.summary?.action === "reject") {
      return res.status(400).json({ 
        message: "Content rejected by moderation.",
        reason: moderationResult.summary?.reason || "Content policy violation"
      });
    }

    let mediaId = moderationResult?.request?.id || null;

    // Upload to Cloudinary
    if (file.mimetype.startsWith("image/")) {
      // For images, use the uploaded image as both file and thumbnail
      mediaId = null;
      const uploadResult = await uploadToCloudinary(file.buffer, "image");
      fileurl = uploadResult.secure_url;
      thumbnailUrl = uploadResult.secure_url;
    } else if (file.mimetype.startsWith("video/")) {
      // For videos, upload video and generate thumbnail
      const uploadResult = await uploadToCloudinary(file.buffer, "video");
      fileurl = uploadResult.secure_url;
      
      // Generate video thumbnail
      const thumbnail = uploadResult.public_id.replace(/\.[^/.]+$/, "");
      thumbnailUrl = cloudinary.url(thumbnail, {
        resource_type: "video",
        format: "jpg",
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto" },
        ],
      });

    } else {
       mediaId = null;
      // For other file types (documents, etc.)
      const uploadResult = await uploadToCloudinary(file.buffer, "raw");
      fileurl = uploadResult.secure_url;
      // You might want to set a default thumbnail for documents
      thumbnailUrl = null;
    }

    // Save to database
    const newFileRecord = await File.create({
      sender: req.user._id,
      path: fileurl,
      thumbnail: thumbnailUrl,
      prompt,
      title,
      mediaId,
      duration: duration || null,
    });

    if (!newFileRecord) {
      return res.status(400).json({ message: "Failed to save file record" });
    }

    // Populate sender information
    const populatedFile = await File.findById(newFileRecord._id).populate(
      "sender",
      "name avatar"
    );

    res.status(201).json(populatedFile);

  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ 
      message: "File upload failed", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  } finally {
    // Clean up temporary file
    if (tmpPath && fs.existsSync(tmpPath)) {
      try {
        await fs.promises.unlink(tmpPath);
      } catch (cleanupError) {
        console.error("Failed to clean up temp file:", cleanupError);
      }
    }
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "uploads",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error("Failed to upload to Cloudinary"));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

const getFileByuser = asyncHandler(async (req, res) => {
  try {
    const id = req.user._id;
    const file = await File.find({ sender: id })
      .populate("sender", "avatar name email")
      .sort({ createdAt: -1 });
    res.status(201).json(file);
  } catch (error) {
    console.log(error);
  }
});
const getFileByvisitor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.find({ sender: id })
      .populate("sender", "avatar name email")
      .sort({ createdAt: -1 });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const getAllFiles = asyncHandler(async (req, res) => {
  const file = await File.find({
    $and: [{ sender: { $ne: req.user._id } }, { mediaId: null }],
  }).populate("sender", "avatar name email");

  res.status(201).json(file ? file : []);
});
const deleteFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id);
    if (file.path) {
      await cloudinary.uploader.destroy(file.path);
    }
    await cloudinary.uploader.destroy(file.thumbnail);
    await File.findByIdAndDelete(id);

    res.status(201).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
const getFileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id).populate("sender", "avatar name ");
    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
const CallbackResponse = asyncHandler(async (req, res) => {
  const content = req.body;
  if (content?.data?.status === "finished") {
    const tempFile = await File.findOne({ mediaId: content.data?.media?.id });
    if (content.data?.summary?.action === "reject") {
      await cloudinary.uploader.destroy(tempFile?.path);
      await File.findByIdAndDelete(tempFile._id);
      return;
    }
    const temp = await File.findByIdAndUpdate(tempFile._id, { mediaId: null });
    io.emit("uncensore", temp._id);
  }
});
export {
  createFile,
  getAllFiles,
  getFileByuser,
  getFileByvisitor,
  getFileById,
  deleteFile,
  CallbackResponse,
};
