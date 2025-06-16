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
    <div className=' flex justify-center flex-col bg-neutral min-h-screen'>
        <div className="flex flex-col items-center gap-4">
  <div className="relative">
              <img
                src={selectedImg}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
          
            </div>
            <p className="text-sm text-zinc-400">
              {isupdating ? "Uploading..." : ""}
            </p>
          </div>

              <div className="flex flex-col items-center justify-center">
                    <p className=" text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{user.name}</p>
                  <label htmlFor="my_modal_7" className='btn btn-sm btn-warning m-1' >
                    <span className="truncate">edit</span>
                  </label>
                    
                  
                  <input type="checkbox" id="my_modal_7" className="modal-toggle" />
                            <div className="modal" role="dialog">
                      <div className="modal-box">
                          <h2 className="font-bold text-lg">Edit Profile</h2>
                          
                        
                              <label className="flex items-center  m-2 gap-2">
                                <Pencil size={24} className='text-warning' />
                                <input
                                  type="text"
                                  placeholder="Enter your name"
                                  value={name}
                                  onChange={(e) => setname(e.target.value)}
                                  className="input input-bordered w-full max-w-xs"
                                />
                              </label>
                           
                              <label className="flex items-center m-2 gap-2">
                                <Camera size={24} className='text-warning' />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="file-input file-input-bordered w-full max-w-xs"
                                />
                              </label>
                          
                              <button
                                className="btn btn-primary w-full"
                                onClick={() => {
                                  Updateuser({ name });
                                  
                                }}
                              >
                                Save Changes
                              </button>
                          
                          
                    </div>
                      <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
                      </div>
                  </div>
      
<div className='flex justify-center m-1'>
<button className='btn  btn-outline btn-warning m-1'>{`${follower.length}${follower.length /1000 >= 1 ? "k":"" }  Followers`}</button>
<button className='btn  btn-outline btn-warning m-1'>{`${follow.length}${follow.length /1000 >= 1 ? "k":"" } Following`}</button>
</div>
 <div className="pb-3">
              <div className="flex border-b border-warning px-4 justify-between">
                <a className={`flex flex-col items-center justify-center border-b-[3px] ${editMode ? "border-b-transparent":"border-b-warning"}   pb-[13px] pt-4 flex-1`} href="#" onClick={()=>setEditMode(false)}>
                  <p className=" text-sm font-bold leading-normal tracking-[0.015em]">Posts</p>
                </a>
                <a className={`flex flex-col items-center justify-center border-b-[3px] ${!editMode ? "border-b-transparent":"border-b-warning"}   pb-[13px] pt-4 flex-1`} href="#" onClick={()=>setEditMode(true)}>
                  <p className=" text-sm font-bold leading-normal tracking-[0.015em]">Saved</p>
                </a>
              </div>
            </div>
<div className='grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4 '>
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
