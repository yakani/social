import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Poststore } from '../store/post.store'
import Reactplayer from 'react-player';
import Showmessage from '../component/Showmessage';
import { Commentstore } from '../store/comment.store';
import Messageinput from '../component/Messageinput';
import { HeartHandshakeIcon, HeartIcon, MoveRightIcon, SaveIcon, SaveOff, X } from 'lucide-react';
const Playpage = () => {
    const {playingpost , nexplay , posts ,previousplay } = Poststore();
    const {comments ,listencomment ,stoplisten , getcomments , isloadingcomment} = Commentstore();
    const [goal ,setgoal] = useState(comments);
    const [play,setplay] = useState(playingpost);
    const navigate  = useNavigate();
  const Go = ()=>{
    nexplay();
  }
  const Pre = ()=>{
    previousplay();
  }
useEffect(()=>{
setplay(playingpost);
getcomments(playingpost._id);
  },[ playingpost]);
useEffect(()=>{
listencomment(playingpost._id);
return ()=>stoplisten();
},[ listencomment , stoplisten ]);
    useEffect(()=>{
        setgoal(comments);
    },[comments]);
  return (
    <div className='flex justify-center bg-neutral min-h-screen '>
        <div className='flex flex-col bg-primary/10 rounded-lg p-1 max-h-[95vh]'>
      <div className='rounded-lg m-1 flex justify-center items-center'>
        {play.path ? 
            <Reactplayer
                url={
                    play.path
                }
                light={play.thumbnail}
                controls={true}
                
            />:
           <img
                src={play.thumbnail}
                className='w-[300px] h-[300px]'
            />
            }
      </div>
      <div className='flex justify-between m-2'>
         <div className='flex flex-col '>
            <p className='text-2xl font-bold '> {play.title} </p>
            <p className='text-xl  ' > {play.prompt} </p>
      </div>
      <div className="rating">
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="1 star" />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="2 star" defaultChecked />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="3 star" />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="4 star" />
  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label="5 star" />
</div>
      </div>
    
  
            <div className='flex justify-center mt-4'>
        {/* Open the modal using document.getElementById('ID').showModal() method */}

<label htmlFor="my_modal_7" className="btn">comments</label>
<input type="checkbox" id="my_modal_7" className="modal-toggle" />
  <div className="modal" role="dialog">
    <div className="modal-box">
      {isloadingcomment ? 
      <div className="skeleton h-20 w-20"></div> : 
      <>
        <Showmessage comment={goal.length  >= 0  ? goal : [goal]}/>
     <Messageinput id={play._id}/>
      </> }
      
  </div>
    <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
  </div>
      </div>
            <div className='flex justify-between rounded-full  max-h-[50px] items-center mt-3 ' >
            {
         posts.length > 1? <> <button className="join-item btn btn-outline btn-warning"
          onClick={Pre}
          disabled={posts[0]._id  == playingpost._id}>Previous</button>
  <button className="join-item btn btn-outline btn-warning" 
  disabled={posts[posts.length-1]._id  == playingpost._id}
  onClick={Go}>Next</button></> :<></>
        }
      </div>
      </div>
      <div className='flex flex-col items-center p-3 cursor-pointer' >
          <div className='flex justify-center rounded-full bg-warning max-h-[50px] items-center' onClick={()=>navigate("/")}>
        <X className='size-10  m-2 '/>
      </div>
      <div>
        <HeartIcon className='size-10 m-2 text-warning'/>
      </div>
      <div>
        <SaveIcon className='size-10 m-2 text-warning'/>
      </div>
      <div></div>
      </div>
    
      
    </div>
  )
}

export default Playpage
