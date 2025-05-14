import React from 'react'

const Presentskeleton = () => {
 
  return (
   
   <div  className="flex w-60 flex-col m-2 ">
  <div className="flex items-center gap-4">
    <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
    <div className="flex flex-col gap-4">
      <div className="skeleton h-4 w-20"></div>
      <div className="skeleton h-4 w-28"></div>
    </div>
  </div>
  <div className="skeleton h-40 w-full"></div>
</div>
   
  )
}

export default Presentskeleton
