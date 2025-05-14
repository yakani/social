import { X } from "lucide-react";
import { Userstore } from "../store/user.store";
import { Messagestore } from "../store/message.store";


const ChatHeader = () => {
  const { recever, setricever } = Messagestore();
  const { onlineuser } = Userstore();

  return (
    <div className="p-2.5 rounded-lg bg-primary/10 ">
      <div className="flex items-center justify-between shadow-lg shadow-yellow-400 ">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={recever.avatar || "/avatar.png"} alt={recever.name} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-primary-content">{recever.name}</h3>
            <p className="text-sm text-primary-content">
              {onlineuser.includes(recever._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setricever(null)}>
          <X className="text-warning cursor-pointer"/>
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;