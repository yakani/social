import React,{useEffect} from 'react'
import Sidebar from '../component/Sidebar'
import Chatcontainer from '../component/Chatcontainer'
import Nochat from '../component/Nochat'
import { Messagestore } from '../store/message.store'
const Chatpage = () => {
    const {recever} = Messagestore();
  return (
    <div className='min-h-screen bg-neutral'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-neutral rounded-lg shadow-cl w-full max-w-6xl min-h-screen '>
          <div className="flex h-full overflow-hidden rounded-lg">
            <Sidebar/>
            { recever ? <Chatcontainer/>:<Nochat/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatpage
