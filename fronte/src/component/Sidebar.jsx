import React, { useEffect ,useState } from 'react'
import { Messagestore } from '../store/message.store';
import Sidebarskeleton from './skeleton//sidebarskeleton';
import { Users } from "lucide-react";
import { Userstore } from '../store/user.store';
const Sidebar = () => {
  const { setricever, recever } = Messagestore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const {onlineuser , alluser , getalluser , isloading } = Userstore();
   const [filteredUsers, setFilteredUsers] = useState(alluser);
   const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(()=>{
    getalluser();
  },[getalluser]);
    useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Always show sidebar on desktop
      } else {
        setIsOpen(false); // Hide sidebar on mobile by default
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
    useEffect(() => {
      console.log(onlineuser);
    const filtered = showOnlineOnly
      ? alluser.filter((user) => onlineuser.includes(user._id))
      : alluser;
    setFilteredUsers(filtered);
  }, [showOnlineOnly, alluser, onlineuser]);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlefilter  = (e)=>{
    const searchTerm = e.target.value.toLowerCase();
       if (searchTerm) {
      const filtered = alluser.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      const filtered = showOnlineOnly
        ? alluser.filter((user) => onlineuser.includes(user._id))
        : alluser;
      setFilteredUsers(filtered);
    }
  };
  if(isloading) return <Sidebarskeleton/>
  return (<>

        {isMobile && (
        <button
          onClick={toggleSidebar}
          className=" fixed z-50 top-4 left-4 p-2 rounded-md bg-gray-800 text-white md:hidden cursor-pointer"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      )}
      
    <aside    className={`fixed
           md:static z-40 top-4 left-0 right-0  ${isMobile ? 'max-h-[600px]' : ' overflow-y-auto'} 
          ${isMobile ? 'w-full' : 'w-70'}
          ${isOpen ? 'translate-x-0 w-70' : '-translate-x-full md:translate-x-0 md:w-20'} 
          border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100 m-2
        `}>
      
      <div>
        <label className="input">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
  <input type="search" required placeholder="Search" onChange={(e)=>handlefilter(e)} />
</label>
      </div>
      
      <div className="  w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-warning"  />
          <span className="font-medium  text-primary-content lg:block">Contacts</span>
        </div>
     
        <div className="mt-3  lg:flex items-center gap-2">
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
            onClick={() => {
             setricever(user) ;
              if (isMobile) setIsOpen(false);
            } }
            className={`
              w-full p-3 flex  items-center gap-3 cursor-pointer
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
            <div className=" text-left min-w-0  ">
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
         {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}</>
  
  )
}

export default Sidebar