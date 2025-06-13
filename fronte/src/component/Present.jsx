import React from 'react'
import { Poststore } from '../store/post.store'
import { useNavigate } from 'react-router';
import { Commentstore } from '../store/comment.store';
import { Trash2Icon } from 'lucide-react';

const Present = ({post,admin=false ,func }) => {
  const { setplayingpost } = Poststore();
  const { getcomments} = Commentstore();
  const navigate  = useNavigate();
  const Go = ()=>{
    setplayingpost(post);
    getcomments(post._id);  // get comments for post
    navigate("/play");
  }
  return (
    <div className='flex flex-col p-4 max-w-[300px] cursor-pointer hover:shadow-xl shadow-warning' >
      <div className="flex justify-between">
        { !admin ? <img src={post.sender.avatar} alt=""  className='w-[40px] h-[40px] rounded-full'/>:<></>} 
        <div className='flex flex-col m-1'>
            <p className="text-center text-2xl text-primary-content overflow:hidden ">{post.title}</p>
            <span className='className="text-center text-lg text-primary-content '>{post.sender.name}</span>
        </div>
        {admin ? <label htmlFor='my_modal_7' className=' rounded-box w-10 btn '>
          <span className="material-icons">.</span>
        <span className="material-icons">.</span></label>:<></>}

        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
          <div className="modal" role="dialog">
    <div className="modal-box">

   <ul className="menu menu-xs  rounded-box w-56">
  { admin ?<li><a><Trash2Icon size={24} className='text-warning' onClick={()=>func(post._id)}/></a></li> : null}
</ul>   
  </div>
    <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
  </div>
      </div >
      <img src={post.thumbnail} alt=""  className='w-[300px] h-[300px] rounded-xl' onClick={Go}/>
    </div>
  )
}

export default Present
