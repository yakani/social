import React, { useEffect, useState } from 'react'
import { Userstore } from '../store/user.store'
import { Poststore } from '../store/post.store';
import { Loader, Search } from 'lucide-react';
import Present from '../component/Present';
import Presentskeleton from '../component/skeleton/presentskeleton';
import { Messagestore } from '../store/message.store';
import { useNavigate } from 'react-router';


const Profilepage = () => {
    const {  followingvistor , followervistor  , Following ,unfollow , follows} = Userstore();
    const navigate = useNavigate();
    const {setricever} = Messagestore();
    const [list ,setlist ]= useState(Following);
    const {isloadingpostuser , postsvisitor } = Poststore();
    const [goal, setgoal] = useState(postsvisitor );
    const skeletonContacts = Array(3).fill(null);
    const [follow ,setfollow] = useState(followingvistor);
    const [follower ,setfollower] = useState(followervistor);
    const [editMode, setEditMode] = useState(false);
    useEffect(()=>{
        setgoal(postsvisitor);
    },[postsvisitor]);

    useEffect(()=>{
        setfollow(followingvistor);
        setfollower(followervistor);
        setlist(Following.map((t)=>t.Author._id));
    },[followingvistor, followervistor ,Following]);
    if( isloadingpostuser) return (
<div className="flex justify-center items-center h-screen">
  <Loader className='size-10 animate-spin text-yellow-500'/>
</div>
);


  return (
    <div className=' flex justify-center flex-col bg-neutral min-h-screen'>
        <div className="flex flex-col items-center gap-4">
  <div className="relative">
              <img
                src={goal[0].sender.avatar}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
          
            </div>
        
          </div>

              <div className="flex flex-col items-center justify-center">
                    <p className=" text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{goal[0].sender.name}</p>
                    <div className='flex justify-center gap-4 text-sm text-primary-content'>
                    <p className=''>{`${follower.length}${follower.length /1000 >= 1 ? "k":"" }  Followers`}</p>
                    <p className=''>{`${follow.length}${follow.length /1000 >= 1 ? "k":"" }  Following`}</p></div>
                  </div>
      {console.log(goal)}
<div className='flex justify-center m-1'>
<button className='btn  btn-outline btn-warning m-1'
onClick={()=>{setricever(goal[0].sender); navigate('/chat') ;}}
>{`Message`}</button>
<button className='btn  btn-outline btn-warning m-1'
onClick={()=>{list.includes(goal[0].sender._id) ? unfollow({Author:goal[0].sender._id}) : follows({Author:goal[0].sender._id})}}

>{`${list.includes(goal[0].sender._id) ? "Unfollow" : "Follow"}`}</button>
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
    
    </div>:goal.map((t)=><div key={t._id} className='flex flex-col justify-center  items-center'>

      <Present post={t} visit={true} /></div>)}

    </div>
</div>
  )
}

export default Profilepage
