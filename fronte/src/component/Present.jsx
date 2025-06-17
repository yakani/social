import React from 'react'
import { Poststore } from '../store/post.store'
import { useNavigate } from 'react-router';
import { Commentstore } from '../store/comment.store';
import { Trash2Icon } from 'lucide-react';
import { Userstore } from '../store/user.store';

const Present = ({post,admin=false ,func , visit=false }) => {
  const { setplayingpost ,getpostsvisitor } = Poststore();
  const { getvisitorfollowing , getvisitorfollowers  ,getPeoplefollowing} = Userstore();
  const { getcomments} = Commentstore();
  const navigate  = useNavigate();
  const Go = ()=>{
    setplayingpost(post);
    getcomments(post._id);  // get comments for post
    navigate("/play");
  }
  return (
    <div className='flex flex-col p-4 max-w-[300px] cursor-pointer  hover:shadow-xl shadow-warning' >
      <div className={`flex ${admin ? 'justify-end' : 'justify-between'} items-center`}>
        
        {admin ? <label htmlFor='my_modal_5' className=' flex items-center gap-1 m-2 cursor-pointer'>
        <div className="badge badge-warning badge-xs"></div>
         <div className="badge badge-warning badge-xs"></div>
      </label>:<></>}

        <input type="checkbox" id="my_modal_5" className="modal-toggle" />
          <div className="modal" role="dialog">
    <div className="modal-box">

  { admin ?<a className='flex justify-center'><Trash2Icon size={24} className='text-warning' onClick={()=>func(post._id)}/></a> : null}

  </div>
    <label className="modal-backdrop" htmlFor="my_modal_5">Close</label>
  </div>
      </div >
      <div className='flex flex-col items-center justify-center gap-2'>

     
      <img src={post.thumbnail} alt=""  className='size-60 rounded-lg object-cover ' onClick={Go}/>
      { !admin && !visit ?<> <img src={post.sender.avatar} alt=""  className='size-13 rounded-full object-cover border-1 cursor-pointer'
        onClick={()=>{// get comments for post
          getpostsvisitor(post.sender._id);
            getvisitorfollowing( post.sender._id );
        getvisitorfollowers( post.sender._id);
        getPeoplefollowing();
          navigate('/visit');
        }}
      />
        
        <span className='className="text-center text-lg text-primary-content '>{post.sender.name}</span>
            <p className="text-center text-2xl text-primary-content overflow:hidden ">{post.title}</p>
            
        </>:<></>} </div>
    </div>
  )
}

export default Present
