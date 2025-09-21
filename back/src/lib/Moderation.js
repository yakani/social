import axios from "axios";
import FormData from "form-data";

const MAX_DIRECT_SIZE = 49 * 1024 * 1024; // 25MB limit for direct API

export async function moderateMedia(buffer, name, mimetype, userId, apiSecret, duration) {
  const data = new FormData();
  
  // Check if file size exceeds direct API limit
  if (buffer.length > MAX_DIRECT_SIZE) {
    // Use Upload API for large files
    const uploadData = new FormData();
    uploadData.append("media", buffer, { filename: name, contentType: mimetype });
    uploadData.append("api_user", userId);
    uploadData.append("api_secret", apiSecret);

    try {
      // First upload the file
      const uploadResponse = await axios.post(
        "https://api.sightengine.com/1.0/video/upload.json",
        uploadData,
        { headers: uploadData.getHeaders() }
      );

      // Now moderate using the uploaded file's URL
      const moderationData = new FormData();
      moderationData.append("media_url", uploadResponse.data.media.url);
      moderationData.append("workflow", mimetype.startsWith("video/") 
        ? "wfl_iVgsawcIGihrv6l7e6ziF" 
        : "wfl_iVgpt3JDFmBOfzFfRPGR1");
      moderationData.append("api_user", userId);
      moderationData.append("api_secret", apiSecret);
      
      if(duration > 60) {
        moderationData.append("callback_url", `${process.env.URL}/post/moderation`);
      }

      const moderationResponse = await axios.post(
        `https://api.sightengine.com/1.0/${mimetype.startsWith("video/") ? "video/":""}${duration == 0 || duration > 60 ? "check-workflow":"check-workflow-sync"}.json`,
        moderationData,
        { headers: moderationData.getHeaders() }
      );

      return moderationResponse.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Original code for files under size limit
  data.append("media", buffer, { filename: name, contentType: mimetype });
  const workflow = mimetype.startsWith("video/")
    ? "wfl_iVgsawcIGihrv6l7e6ziF"
    : "wfl_iVgpt3JDFmBOfzFfRPGR1";
  data.append("workflow", workflow);
  data.append("api_user", userId);
  data.append("api_secret", apiSecret);
  
  if(duration > 60) {
    data.append("callback_url", `${process.env.URL}/post/moderation`);
  }

  try {
    const res = await axios.post(
      `https://api.sightengine.com/1.0/${mimetype.startsWith("video/") ? "video/":""}${duration == 0 || duration > 60 ? "check-workflow":"check-workflow-sync"}.json`,
      data,
      { headers: data.getHeaders() }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}