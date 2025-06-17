import React from 'react'

const List = ( {title , items}) => {
  return (

      <ul className="list bg-base-100 rounded-box shadow-md">
  
  <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{title}</li>
  {items.map((item, index) => {


  <li className="list-row" key={index}>
    <div><img className="size-10 rounded-box" src={item.avatar}/></div>
    <div>
      <div>{item.name}</div>
    </div>
    <button className="btn  btn-outline btn-warning m-1">
     unfollow
    </button>

  </li>  })}
  

  
</ul>

  )
}

export default List
