import React, { useState } from "react";
import toast from "react-hot-toast";
import { Poststore } from "../store/post.store";
import { Loader } from "lucide-react";

const Uploadvideo = () => {
  const { createPost, isadding } = Poststore();
  const [formData, setformData] = useState({
    title: "",
    prompt: "",
  });
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    let id = false;
    if (file.type.includes("image")) {
      if (file.size > 10485760)
        return toast.error("file to large more than 10mb");
      id = true;
    } else {
      if (file.size > 104857600)
        return toast.error("file to large more than 100mb");
    }
    setformData({ ...formData, file: file });
  };
  const Validationform = () => {
    if (!formData.title.trim()) return toast.error("Tittle require");
    if (!formData.prompt.trim()) return toast.error("Prompt require");
    if (formData.file === null) return toast.error("file is require");
    if (formData.prompt.split("#").length < 2)return toast.error("at least two prompt");
    return true;
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    const succes = Validationform();
    if (succes === true) {
      const form = new FormData();
      form.append("file", formData.file);
      form.append("title", formData.title);
      form.append("prompt", formData.prompt);
      await createPost(form);
    }
    setformData({
      title: "",
      prompt: "",
      file: null,
    });
  };

  return (
    <div className="">
      <form
        onSubmit={handlesubmit}
        className="flex justify-center min-h-[90vh] w-full p-4 bg-neutral"
      >
        <div className="flex flex-col justify-between max-h-[400px] ">
          <h1 className="text-center text-primary-content text-bold text-4xl ">
            {" "}
            Upload a post
          </h1>

          <label className="flex flex-col ">
            <span className="text-xl text-start text-primary-content">
              Post title
            </span>
            <input
              type="text"
              placeholder="tittle.."
              className="p-4 text-center input input-lg"
              value={formData.title}
              onChange={(e) =>
                setformData({ ...formData, title: e.target.value })
              }
            />
          </label>
          <label className="flex flex-col ">
            <span className="text-xl text-start text-primary-content">
              Post(image/video)
            </span>
            <input
              type="file"
              placeholder="tittle.."
              className="file-input file-input-lg file-input-warning"
              accept="image/* , video/*"
              onChange={handleImageUpload}
            />
          </label>
          <label className="flex flex-col ">
            <span className="text-xl text-start text-primary-content">
              propmts
            </span>
            <input
              type="text"
              placeholder="#big#beauty"
              className="p-4 text-center input input-lg"
              value={formData.prompt}
              onChange={(e) =>
                setformData({ ...formData, prompt: e.target.value })
              }
            />
          </label>
          <button className="btn btn-lg btn-warning" type="submit">
            {isadding ? (
              <div className="flex ">
                <Loader className="size-10 animate-spin " />
                <p className="text-lg ">Uploading...</p>
              </div>
            ) : (
              "submit & publish"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Uploadvideo;
