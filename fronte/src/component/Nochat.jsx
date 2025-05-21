import React ,{useEffect} from 'react'

import { MessageSquare } from 'lucide-react'
import { Messagestore } from '../store/message.store';
const Nochat = () => {
 
  return (
    <div className="w-full flex flex-1 flex-col max-h-[500px] items-center justify-center p-16 bg-primary/10">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary-content flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-warning " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-primary-content"> Chat!</h2>
        <p className="text-primary-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  )
}

export default Nochat