import React, { useEffect ,useState } from 'react'
import { Messagestore } from '../store/message.store';
import Sidebarskeleton from './skeleton//sidebarskeleton';
import { Users } from "lucide-react";
import { Userstore } from '../store/user.store';
const Sidebar = () => {
  const { setricever, recever } = Messagestore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const {onlineuser , alluser , getalluser , isloading } = Userstore();
  useEffect(()=>{
    getalluser();
  },[getalluser])
  const filteredUsers = showOnlineOnly
  ? alluser.filter((user) => onlineuser.includes(user._id))
  : alluser;

  if(isloading) return <Sidebarskeleton/>
  return (
    <aside className="max-h-[500px] w-20 lg:w-72  m-2 bg-primary/10 rounded-lg  flex flex-col transition-all duration-200">
      <div className="  w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-warning"  />
          <span className="font-medium hidden text-primary-content lg:block">Contacts</span>
        </div>
     
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-warning"
            />
            <span className="text-sm text-primary-content">Show online only</span>
          </label>
          <span className="text-xs text-primary-content">({onlineuser.length == 0 ? 0: onlineuser.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setricever(user)}
            className={`
              w-full p-3 flex items-center gap-3 cursor-pointer
              hover:bg-warning/20 transition-colors
              ${recever?._id === user._id ? " bg-warning/10 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineuser.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-warning 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0  ">
              <div className="font-medium text-primary-content">{user.name}</div>
              <div className="text-sm text-primary-content">
                {onlineuser.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  
  )
}

export default Sidebar