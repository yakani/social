import React from 'react'
import { Poststore } from '../store/post.store'
import { useNavigate } from 'react-router';
import { Commentstore } from '../store/comment.store';

const Present = ({post }) => {
  const { setplayingpost } = Poststore();
  const { getcomments} = Commentstore();
  const navigate  = useNavigate();
  const Go = ()=>{
    setplayingpost(post);
    getcomments(post._id);  // get comments for post
    navigate("/play");
  }
  return (
    <div className='flex flex-col p-4 max-w-[300px] cursor-pointer hover:shadow-xl shadow-warning' onClick={Go}>
      <div className="flex justify-between">
        <img src={post.sender.avatar} alt=""  className='w-[40px] h-[40px] rounded-full'/>
        <div className='flex flex-col m-1'>
            <p className="text-center text-2xl text-primary-content overflow:hidden ">{post.title}</p>
            <span className='className="text-center text-lg text-primary-content '>{post.sender.name}</span>
        </div>
      </div>
      <img src={post.thumbnail} alt=""  className='w-[300px] h-[300px] rounded-xl'/>
    </div>
  )
}

export default Present
