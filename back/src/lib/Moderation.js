import axios from "axios";
import FormData from "form-data";

const MAX_DIRECT_SIZE = 50 * 1024 * 1024; // 50MB limit for direct API

async function handleLargeFile(buffer, name, mimetype, userId, apiSecret, duration) {
  const uploadData = new FormData();
  uploadData.append("media", buffer, { filename: name, contentType: mimetype });
  uploadData.append("api_user", userId);
  uploadData.append("api_secret", apiSecret);

  // First upload the file
  const uploadResponse = await axios.get(
    "https://api.sightengine.com/1.0/upload/create-video.json",
    {
      params: {
        'api_user': userId,
        'api_secret': apiSecret
      }
    }
  );
const { url: uploadUrl, expires } = uploadResponse.data.upload;
    const { id: mediaId } = uploadResponse.data.media;
const uploadFileResponse = await axios.put(uploadUrl, buffer, {
      headers: {
        'Content-Type': mimetype,
        'Content-Length': buffer.length
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300000 // 5 minutes timeout
    });
  // Now moderate using the uploaded file's URL
  const moderationData = new FormData();
  moderationData.append("media_id", mediaId);
  moderationData.append("workflow", mimetype.startsWith("video/")
    ? "wfl_iVgsawcIGihrv6l7e6ziF"
    : "wfl_iVgpt3JDFmBOfzFfRPGR1");
  moderationData.append("api_user", userId);
  moderationData.append("api_secret", apiSecret);

  if (duration > 60) {
    moderationData.append("callback_url", `${process.env.URL}/post/moderation`);
  }

  const moderationResponse = await axios.post(
    `https://api.sightengine.com/1.0/${mimetype.startsWith("video/") ? "video/" : ""}${duration == 0 || duration > 60 ? "check-workflow" : "check-workflow-sync"}.json`,
    moderationData,
    { headers: moderationData.getHeaders() }
  );

  return moderationResponse.data;
}

async function handleSmallFile(buffer, name, mimetype, userId, apiSecret, duration) {
  const data = new FormData();
  data.append("media", buffer, { filename: name, contentType: mimetype });
  const workflow = mimetype.startsWith("video/")
    ? "wfl_iVgsawcIGihrv6l7e6ziF"
    : "wfl_iVgpt3JDFmBOfzFfRPGR1";
  data.append("workflow", workflow);
  data.append("api_user", userId);
  data.append("api_secret", apiSecret);

  if (duration > 60) {
    data.append("callback_url", `${process.env.URL}/post/moderation`);
  }

  const res = await axios.post(
    `https://api.sightengine.com/1.0/${mimetype.startsWith("video/") ? "video/" : ""}${duration == 0 || duration > 60 ? "check-workflow" : "check-workflow-sync"}.json`,
    data,
    { headers: data.getHeaders() }
  );
  return res.data;
}

export async function moderateMedia(buffer, name, mimetype, userId, apiSecret, duration, length = 0) {
  try {
    if (length > MAX_DIRECT_SIZE) {
      return await handleLargeFile(buffer, name, mimetype, userId, apiSecret, duration);
    } else {
      return await handleSmallFile(buffer, name, mimetype, userId, apiSecret, duration);
    }
  } catch (error) {
    throw error.response?.data || error.message;
  }
}