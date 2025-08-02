import asyncHandler from "express-async-handler";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getusersocketid } from "../lib/socket.js";
import { moderateMedia } from "../lib/Moderation.js";

const createMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const text = content ? content : null;
  const file = req.files.file
    ? req.files.file.length > 1
      ? req.files.file
      : req.files.file[0]
    : null;
  try {
    let fileurl = null;
    if (file) {
      const moderationResult = await moderateMedia(
        file.buffer,
        file.fileName,
        file.mimetype,
        process.env.SIGHTENGINE_USER_ID,
        process.env.SIGHTENGINE_API_SECRET,
        0
      );
      if (moderationResult.summary?.action === "reject") {
        return res
          .status(400)
          .json({ message: "Content rejected by moderation." });
      }
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
    }
    const messageDoc = await Message.create({
      sender: req.user._id,
      receiver: id,
      content: text,
      file: fileurl,
    });
    const message = await Message.findById(messageDoc._id).populate(
      "sender",
      "name avatar"
    );
    const receverid = getusersocketid(req.params.id);
    if (receverid) {
      io.to(receverid).emit("msg", message, req.user.name);
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: id },
        { sender: id, receiver: req.user._id },
      ],
    })

      .populate("sender", "name email avatar createdAt")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
const lastMessages = asyncHandler(async (req, res) => {
  const id = req.user._id;
  try {
    const last = await Message.find({ $or: [{ sender: id }, { receiver: id }] })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("sender", "name  avatar")
      .populate("receiver", "name avatar");
    res.status(200).json(last);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});
export { deleteMessage, getMessages, createMessage, lastMessages };
