import { useRef, useState } from "react";
import { Messagestore } from "../store/message.store";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";


const Messageinput = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendmessage } = Messagestore();
  
    const handleImageChange = (e) => {
      const files = e.target.files[0];
      if (!files.type.startsWith("image/") ||files.size >10485760) {
        toast.error("Please select an image file");
        return;
      }
      setFile(files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files);
    };
  
    const removeImage = () => {
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
    };
  
    const handleSendmessage = async (e) => {
      e.preventDefault();
      if (text  == "" && !imagePreview) return;
      
      const form = new FormData();
      if(text != "" ){
        form.append('content', text);
      }        
        if(file){
          form.append('file', file);
        } 
         
        
      try {
        
        await sendmessage(form);
        // Clear form
        setText("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFile(null);
      } catch (error) {
        console.log("Failed to send message:", error);
      }
    };
  return (
    <div className="p-4 w-full bg-primary/10">
    {imagePreview && (
      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
            type="button"
          >
            <X className="text-warning size-3"  />
          </button>
        </div>
      </div>
    )}

    <form onSubmit={handleSendmessage} className="flex items-center gap-2">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`hidden sm:flex btn btn-circle
                   ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} className="text-warning" />
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim() && !imagePreview}
      >
        <Send size={22} className="text-warning" />
      </button>
    </form>
  </div>
  )
}

export default Messageinput