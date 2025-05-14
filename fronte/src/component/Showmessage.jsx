import React, { useState } from 'react'
import { Userstore } from '../store/user.store'
import { formatMessageTime } from '../lib/temp';
import { Commentstore } from '../store/comment.store';
import Presentskeleton from './skeleton/presentskeleton';
import { DeleteIcon, Trash } from 'lucide-react';


const Showmessage = ({comment}) => {
    const {user}  = Userstore();
    const {isloadingcomment ,deletecomment} = Commentstore();
    const [oncom , setoncom] = useState(false);
    const arr= new Array(1).fill(null);
    return (
      <div className='flex-1 flex flex-col overflow-auto max-h-[200px]'>
    <div className='flex flex-col flex-1 overflow-y-auto'>
{   isloadingcomment ? arr.map((t,id)=><Presentskeleton key={id}/>) :
        comment.length == 0 ? <></> : 
        comment.map((t)=>
           <div key={t._id} className={`chat ${t.sender._id  == user._id ? "chat-end":"chat-start"}`}>
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img
        alt="Tailwind CSS chat bubble component"
        src={t.sender.avatar}
      />
    </div>
  </div>
  <div className="chat-header" onMouseEnter={()=>setoncom(true)} onMouseLeave={()=>setoncom(false)}>
    {t.sender._id === user._id && oncom ? <Trash className='size-5 cursor-pointer text-warning ' onClick={()=>deletecomment(t._id)}/>: <></>}
    {t.sender.name}
    <time className="text-xs opacity-50"> {formatMessageTime(t.createdAt)} </time>
    
  </div>
  {}
  <div className="chat-bubble flex flex-col" >
    {
        t.path ? <img
                  src={t.path}
                  className='sm:max-w-[200px] mb-2 rounded-md'
                /> :<></>
    }
     {t.content  ? <p>{t.content}</p> : <></>}
  </div>
  
</div>
        )
}
    </div>
    </div>
  )
}

export default Showmessage
