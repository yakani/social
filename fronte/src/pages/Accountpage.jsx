import React, { useEffect, useState } from 'react'
import { Userstore } from '../store/user.store'
import { Poststore } from '../store/post.store';
import { Camera, Search, Trash2Icon } from 'lucide-react';
import Present from '../component/Present';
import Presentskeleton from '../component/skeleton/presentskeleton';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router';
const Accountpage = () => {
    const {user , isupdating, Updatepic} = Userstore();
    const {isloadingpostuser , postuser ,deletepost} = Poststore();
    const navigate  = useNavigate();
    const [goal, setgoal] = useState(postuser);
    const skeletonContacts = Array(3).fill(null);
    const [selectedImg, setSelectedImg] = useState(user.avatar || "/avatar.png");
    const [name , setname] = useState(user.name);
    useEffect(()=>{
        setgoal(postuser);
    },[postuser]);
    

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
          <p className='text-2xl text-primary-content text-center'>{user.name}</p>
<div className='flex justify-center'>
<p className='text-primary-content text-xl'></p>
<p className='text-primary-content text-xl'></p>
</div>

<div className='flex justify-center flex-wrap bg-primary/10'>
    { isloadingpostuser ? skeletonContacts.map((t,id)=><Presentskeleton key={id}/> ) : goal.length  == 0 ? <div className='flex flex-col'>
    <Search className='w-24 h-24 text-warning m-2'/>
    <button className='btn btn-lg btn-warning m-2' onClick={()=>navigate('/add')} >Add a post</button>
    </div>:goal.map((t)=><div key={t._id} className='flex flex-col justify-center  items-center'>
      <Trash2Icon className='size-5 text-warning cursor-pointer' onClick={()=>deletepost(t._id)}/>
      <Present post={t} /></div>)}
    
    </div>
</div>
  )
}

export default Accountpage
