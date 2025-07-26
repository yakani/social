import Observe from "../models/observe.model.js";
import asyncHandler from "express-async-handler";
import File from "../models/file.model.js";
import mongoose from "mongoose";
const addObserve = asyncHandler(async (req, res) => {
  const { likes, save, dislikes } = req.body;
  const userId = req.user._id;
  try {
    const existingUser = await Observe.findOne({ userId });
    if (!existingUser) {
      let likesarr = likes ? [likes] : [];
      let savesarr = save ? [save] : [];
      let dislikesarr = dislikes ? [dislikes] : [];
      const createdObserve = await Observe.create({
        userId,
        likes: likesarr,
        saves: savesarr,
        dislikes: dislikesarr,
      });
    } else {
      let savesarr = save ? [...existingUser.saves, save] : [];
      let dislikesarr = dislikes ? [...existingUser.dislikes, dislikes] : [];
      let likesarr = likes ? [...existingUser.likes, likes] : [];
      existingUser.likes =
        likes && !existingUser.likes.includes(likes)
          ? likesarr
          : existingUser.likes;
      existingUser.saves =
        save && !existingUser.saves.includes(save)
          ? savesarr
          : existingUser.saves;
      existingUser.dislikes =
        dislikes && !existingUser.dislikes.includes(dislikes)
          ? dislikesarr
          : existingUser.dislikes;
      await existingUser.save();
    }
    const final = await Observe.findOne({ userId })
      .populate("likes", "prompt")
      .populate("saves", "prompt")
      .populate("dislikes", "prompt");

    res.status(201).json(final);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getObservation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const max = req.query.max;
  try {
    const observation = await Observe.findOne({ userId }).populate(
      "likes",
      "prompt"
    );
    if (!observation) {
      return res.status(404).json({ message: "No observation found" });
    }
    let last;
    let final = [];
    observation.likes.forEach((element) => {
      if (last === element.prompt) return;
      const num = observation.likes.filter(
        (item) =>
          item.prompt === element.prompt ||
          (item.prompt.includes(element.prompt.split("#")[0]) &&
            item.prompt.includes(element.prompt.split("#")[1]))
      ).length;
      final.push({
        prompt: element.prompt,
        count: num,
      });
      last = element.prompt;
    });
    final.sort((a, b) => b.count - a.count);
    const arr = final.map((item) => item.prompt);
    const Response = await Algo(arr, max, userId);
    res.status(200).json(Response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getVisualization = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const observation = await Observe.findOne({ userId });
    if (!observation) {
      return res.status(404).json({ message: "No observation found" });
    }
    res.status(200).json(observation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getSavesfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = id ? id : req.user._id;
    const obs = await Observe.find({ userId })
      .select("-likes -dislikes -userId")
      .populate("saves");
    res.status(200).json(obs);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
const Algo = async (arr, maxnum, Id) => {
  let previous = [];
  let main = [];
  try {
    const posts = await File.find({ $nor: [{ sender: Id }] }).populate(
      "sender",
      "avatar name email"
    );
    previous = posts.filter((t, index) => index < maxnum);
    main = posts.filter((t, index) => index > maxnum - 1);
    const data2 = arr;
    let final = [];
    let stock = [];
    let temp = [];
    let count = 0;
    for (let y = 0; y < data2.length; y++) {
      const element = data2[y];
      if (y == 0) {
        for (var i = 0; i < main.length; i++) {
          if (main[i].prompt.includes(element) && count < 3) {
            count++;
            final.push(main[i]);
          } else if (count > 2) {
            count = 0;
            if (stock.length > 0) {
              final.push(stock.shift());
            } else {
              final.push(main[i]);
            }
            if (main[i].prompt.includes(element)) {
              count++;
              final.push(main[i]);
            } else {
              stock.push(main[i]);
            }
          } else {
            stock.push(main[i]);
          }
        }
        temp = stock;

        stock = [];
      } else {
        count = 0;
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].prompt.includes(element) && count < 3) {
            count++;
            final.push(temp[i]);
          } else if (count > 3) {
            count = 0;
            if (stock.length > 0) {
              final.push(stock.shift());
            } else {
              final.push(temp[i]);
            }
            if (temp[i].prompt.includes(element)) {
              count++;
              final.push(temp[i]);
            } else {
              stock.push(temp[i]);
            }
          } else {
            stock.push(temp[i]);
          }
        }
        temp = stock;
        stock = y == data2.length - 1 ? stock : [];
      }
    }
    final = stock.length > 0 ? final.concat(stock) : final;
    final = previous.concat(final);
    return final;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

const GetfileObserve = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let fileId;
  try {
    // Ensure id is an ObjectId for accurate matching
    fileId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;

    const observation = await Observe.aggregate([
      {
        $group: {
          _id: null,
          likesCount: {
            $sum: {
              $size: {
                $filter: {
                  input: "$likes",
                  as: "like",
                  cond: { $eq: ["$$like", fileId] }
                }
              }
            }
          },
          savesCount: {
            $sum: {
              $size: {
                $filter: {
                  input: "$saves",
                  as: "save",
                  cond: { $eq: ["$$save", fileId] }
                }
              }
            }
          },
          seeCounts: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $in: [fileId, "$likes"] },
                    { $in: [fileId, "$dislikes"] },
                    { $in: [fileId, "$saves"] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Always return counts, even if zero
    const result = observation[0] || { likesCount: 0, savesCount: 0, seeCounts: 0 };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
});

export { addObserve, getObservation, getVisualization, getSavesfile ,GetfileObserve };
