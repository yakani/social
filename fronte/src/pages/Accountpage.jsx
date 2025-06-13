import React, { useEffect, useState } from 'react'
import { Userstore } from '../store/user.store'
import { Poststore } from '../store/post.store';
import { Camera, Pencil, Search, Trash2Icon, X } from 'lucide-react';
import Present from '../component/Present';
import Presentskeleton from '../component/skeleton/presentskeleton';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router';
const Accountpage = () => {
    const {user , isupdating, Updatepic ,Updateuser , getPeoplefollowing , getPeoplefollowers , Following , Followers} = Userstore();
    const {isloadingpostuser , postuser ,deletepost} = Poststore();
    const navigate  = useNavigate();
    const [goal, setgoal] = useState(postuser);
    const skeletonContacts = Array(3).fill(null);
    const [selectedImg, setSelectedImg] = useState(user.avatar || "/avatar.png");
    const [follow ,setfollow] = useState(Following);
    const [follower ,setfollower] = useState(Followers);
    const [name , setname] = useState(user.name);
    const [editMode, setEditMode] = useState(false);
    useEffect(()=>{
        setgoal(postuser);
        getPeoplefollowing();
        getPeoplefollowers();
    },[postuser]);

    useEffect(()=>{
        setfollow(Following);
        setfollower(Followers);
    },[Following, Followers]);

const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if(file.size >10*1024*1024) return toast.error('to large must be less than 10mb');
    const reader = new FileReader();
    const form = new FormData();
    form.append('file',file);
    reader.readAsDataURL(file);
 
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await Updatepic(form);
    };
  };


  return (
    <div className=' flex justify-center flex-col bg-neutral h-screen'>
        <div className="flex flex-col items-center gap-4">
  <div className="relative">
              <img
                src={selectedImg}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isupdating ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isupdating}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isupdating ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className='flex justify-center'>

            {
              editMode ? <>
                <label htmlFor="" className='flex'>
                  <input type="text" id="" placeholder={user.name} className='p-2 w-full text-lg text-primary-content' value={name} onChange={(e)=>setname(e.target.value)}/>
                  <button className='btn btn-lg btn-warning' onClick={async ()=>{await Updateuser({name}) ; setEditMode(false)}}>
                    Update
                  </button>
                </label>
                <X className='size-5 text-warning m-1 cursor-pointer' onClick={()=>setEditMode(false)}  />
              </> : <>
              <p className='text-2xl text-primary-content text-center'>{user.name}</p>
            <Pencil className='size-5 text-warning m-1 cursor-pointer' onClick={()=>setEditMode(true)} /></>
            }
            

          </div>
          
<div className='flex justify-center m-1'>
<button className='btn  btn-outline m-1'>{`${follower.length}${follower.length /1000 >= 1 ? "k":"" }  Followers`}</button>
<button className='btn  btn-outline m-1'>{`${follow.length}${follow.length /1000 >= 1 ? "k":"" } Following`}</button>
</div>

<div className='flex justify-center flex-wrap bg-primary/10'>
    { isloadingpostuser ? skeletonContacts.map((t,id)=><Presentskeleton key={id}/> ) : goal.length  == 0 ? <div className='flex flex-col'>
    <Search className='w-24 h-24 text-warning m-2'/>
    <button className='btn btn-lg btn-warning m-2' onClick={()=>navigate('/add')} >Add a post</button>
    </div>:goal.map((t)=><div key={t._id} className='flex flex-col justify-center  items-center'>

      <Present post={t} admin={true} func={deletepost} /></div>)}

    </div>
</div>
  )
}

export default Accountpage
