import React from 'react'
import { Userstore } from '../store/user.store'

const List = ( {title , items}) => {
  const {unfollow , follows } = Userstore();
  return (

      <ul className="list bg-base-100 rounded-box shadow-md">
  
  <li className="p-4 pb-2 text-xs text-center">{title}</li>
 
  {items.map((item, index) => (
  <li className="list-row" key={index}>
    <div><img className="rounded-full object-cover size-15 " src={item.Author.avatar}/></div>
    <div>
      <div>{item.Author.name}</div>
    </div>
    {
      title == "Following" ?  <button className="btn  btn-outline btn-warning m-1" onClick={()=> unfollow({Author:item.Author._id})}>
     unfollow
    </button> :
     <button className="btn  btn-outline btn-warning m-1"onClick={()=> follows({Author:item.Follower._id})} >
     follow
    </button >
    }
   

  </li>  ))}
  

  
</ul>

  )
}

export default List
