import asyncHandler from "express-async-handler";
import cloudinary from "../lib/cloudinary.js";
import File from "../models/file.model.js";
import { moderateMedia } from "../lib/Moderation.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import { io } from "../lib/socket.js";
const createFile = asyncHandler(async (req, res) => {
  const { prompt, title } = req.body;
  let fileurl = null;
  let thumbailUrl = null;
  const file = req.files.file[0];

  let duration = 0;
  if (file?.mimetype.startsWith("video/")) {
    // Save buffer to temp file, then get duration
    const tmpPath = `./tmp/${Date.now()}_${file.originalname}`;
    await fs.promises.writeFile(tmpPath, file.buffer);
    duration = await getVideoDurationInSeconds(tmpPath);
    await fs.promises.unlink(tmpPath); // Clean up
  }
  let moderationResult;
  // console.log(file);
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
    console.log(error);
    return res.status(500).json({ message: "error occur in control process" });
  }
  // You can adjust this check based on Sightengine response
  if (moderationResult.summary?.action === "reject") {
    return res.status(400).json({ message: "Content rejected by moderation." });
  }
  const mediaId = moderationResult?.request?.id || null;
  if (file.mimetype.startsWith("image")) {
    const uploadimg = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "uploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
    thumbailUrl = uploadimg.secure_url;
  } else {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "uploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
    fileurl = result.secure_url;
    const thumbnail = result.public_id.replace(/\.[^/.]+$/, ""); // Remove extension
    thumbailUrl = cloudinary.url(thumbnail, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 300, height: 300, crop: "fill" },
        { quality: "auto" },
      ],
    });
  }
  try {
    const file = await File.create({
      sender: req.user._id,
      path: fileurl,
      thumbnail: thumbailUrl,
      prompt,
      title,
      mediaId,
    });
    if (!file) {
      return res.status(400).json({ message: "failed to insert" });
    }
    const newfile = await File.findById(file._id).populate(
      "sender",
      "name avatar"
    );
    res.status(201).json(newfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});
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
