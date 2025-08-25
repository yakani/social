import {create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import { Userstore } from './user.store';
import toast from 'react-hot-toast';
export const Messagestore = create((set,get)=>({
    messages:[],
    isloadingmessage:false,
    isdeletingmessage:false,
    issending:false,
    recever:null,
    sendmessage:async(data)=>{
        set({issending:true});
        try {
            const res = await axiosInstance.post('message/'+get().recever._id,data,{
                               headers: {
         'Content-Type': 'multipart/form-data',
      },
            });
            set({messages:[...get().messages,res.data]});
        } catch (error) {
          console.log(error.message);  
        }finally{
            set({issending:false});
        }
    },
    getmessages:async()=>{
        set({isloadingmessage:true});
        try {
            const res = await axiosInstance.get('message/'+get().recever._id);
            set({messages:res.data});
        } catch (error) {
          console.log(error.message);  
        }finally{
            set({isloadingmessage:false});
        }
    },
    deletemessage:async(id)=>{
        set({isdeletingmessage:true});
        try {
            const res = await axiosInstance.delete('message/'+id);
            const remove  = get().messages.filter(t=>t._id !=id);
            set({messages:remove});
        } catch (error) {
          console.log(error.message);  
        }finally{
            set({isdeletingmessage:false});
        }
    },
    listenmessage:()=>{
        const {recever} = get();
        if(!recever) return ;
       const sock =  Userstore.getState().socket;
       sock.on("msg",(msg,name)=>{
        if(msg.sender?._id != recever._id){
            
            toast.success(`${name} : ${msg.content ? msg.content : "image"}`);
            return;
        };
        set({messages:[...get().messages,msg]});

       })
    },
    stoplisten:()=>{
        const sock =  Userstore.getState().socket;
        sock.off("msg");
    },
    setricever:(data)=>set({recever:data})

}));