import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from './Chatheader';
import Messageinput from './Chatinput';
import { Userstore } from '../store/user.store';
import { Messagestore } from '../store/message.store';
import MessageSkeleton from './skeleton/messageskeleton';
import { formatMessageTime } from '../lib/temp';
import { Trash } from 'lucide-react';

const Chatcontainer = () => {
  const {isloadingmessage ,messages , getmessages , recever ,listenmessage,stoplisten , deletemessage} = Messagestore();
const { user} = Userstore();
const messageEndRef =useRef(null);
const [conn,setconn] = useState(false);
   useEffect(()=>{
    getmessages(recever._id);
    listenmessage();
    return ()=>stoplisten();
  },[recever._id , getmessages , stoplisten , listenmessage]);

useEffect(()=>{
  if (messageEndRef.current && messages) {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
},[messages])
  if(isloadingmessage) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
      <Messageinput/>
    </div>
  )
 
  return (
    <div  className="flex-1 flex flex-col overflow-auto max-h-[500px]">
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto space-y-4 bg-primary/10">
          {messages.map((msg)=>
          <div key={msg._id}
          className={`chat ${msg.sender?._id === user._id ? "chat-end":"chat-start"}`}
          ref={messageEndRef}>
            <div className="chat-file avatar">
              <div className="size-10 rounded-full border">
                <img src={msg.sender?.avatar} alt="" />
              </div>
            </div>
            <div className='chat-header mb-1 cursor-pointer' onMouseEnter={()=>setconn(true)} onMouseLeave={()=>setconn(false)} >
              { conn ? <Trash className='text-warning size-6' onClick={()=>deletemessage(msg._id)} /> :<></> }
              <time  className="text-xs opacity-50 ml-1 text-primary-content ">
                {formatMessageTime(msg.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {
                msg.file  ? <img
                  src={msg.file}
                  className='sm:max-w-[100px] mb-2 rounded-md'
                /> :<></>
              }
              {msg.content  ? <p>{msg.content}</p> : <></>}
            </div>

          </div>)}
      </div>
      <Messageinput/>
    </div>
  )
}

export default Chatcontainer