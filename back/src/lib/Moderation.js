import axios from "axios";
import FormData from "form-data";
export async function moderateMedia(buffer, name, mimetype, userId, apiSecret ,duration) {
  const data = new FormData();
  data.append("media", buffer, { filename: name, contentType: mimetype });
  // Use different workflow for image/video
  const workflow =
    mimetype.startsWith("video/")
      ? "wfl_iVgsawcIGihrv6l7e6ziF"
      : "wfl_iVgpt3JDFmBOfzFfRPGR1";
  data.append("workflow", workflow);
  data.append("api_user", userId);
  data.append("api_secret", apiSecret);
  if(duration> 60){
    data.append("callback_url" , `${process.env.URL}/post/moderation`);
  }

  try {
    const res = await axios.post(
      `https://api.sightengine.com/1.0/${mimetype.startsWith("video/") ? "video/":""}${duration  == 0 || duration > 60 ? "check-workflow":"check-workflow-sync"}.json`,
      data,
      { headers:  data.getHeaders()  }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}