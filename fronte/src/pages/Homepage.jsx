import React, { useEffect, useState } from 'react'
import Present from '../component/Present'
import Presentskeleton from '../component/skeleton/presentskeleton'
import { Poststore } from '../store/post.store'
import { ArrowDownLeftFromCircle } from 'lucide-react'

const Homepage = () => {
  const { isloadingpost , posts ,numb  ,setnumb } = Poststore();
  const [num,setnum] = useState(numb);
  const [all,setall] = useState(posts);
  const n = all.filter((t , indx)=> indx >= numb && indx < numb+3);
  const [goal ,setgoal ] = useState(n);
  const skeletonContacts = Array(3).fill(null);
  useEffect(()=>{
    setall(posts);
  },[posts]);
  useEffect(()=>{
    setgoal(all.filter((t , indx)=> indx >= numb && indx < numb+3));
  },[all]);
  useEffect(()=>{
    let arr = [];
    for(var i = num ; i < all.length ; i++){
        arr.push(all[i]);
        if(arr.length === 3) break;
    }
    
setgoal(arr);
setnumb(num);
  },[num]);
  return (
    <div className='bg-neutral min-h-screen   flex flex-col justify-center items-center'>
      {
       isloadingpost ? <div className='grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4 '>
        {
          skeletonContacts.map((index,id)=>< Presentskeleton keys={id}/>)
        }
       </div> : all.length == 0 ?<div className='flex justify-center items-center'><p
       className='text-xl text-center text-primary-content p-2 '>
        nothing yet post ...
       </p></div> : all.length > 0 ? <div className='flex '> {goal.map((t)=><Present key={t._id} post={t}/>)} 
       </div> : <Present key={0} post={goal} />
      }
      <div className="join grid grid-cols-2">
        {
         all.length > 3 ? <> <button className="join-item btn btn-outline btn-warning"
          onClick={()=>setnum(num > 2 ? num-3 : 0)}
          disabled={num<3}>Previous page</button>
  <button className="join-item btn btn-outline btn-warning" 
  disabled={num >= all.length -3}
  onClick={()=>setnum(all.length>=num+3 ? num+3 : num)}>Next</button></> :<></>
        }

</div>
      
    </div>
  )
}

export default Homepage
