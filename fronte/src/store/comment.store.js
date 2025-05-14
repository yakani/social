import {create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import { Poststore } from './post.store';
import { Userstore } from './user.store';

export const Commentstore = create((set,get)=>({
    isloadingcomment:false,
    sendcomment:false,
    deletecomment:false,
    comments:[],
    createcomment:async(data ,id)=>{
        set({sendcomment:true});
        try {
           const res = await axiosInstance.post('comment/'+id,data,{
                           headers: {
         'Content-Type': 'multipart/form-data',
      },
           });
          //add comment to post comments list in poststore
          
        } catch (error) {
            console.log(error.message);
        }finally{
            set({sendcomment:false});
        }
    },
    getcomments: async(id)=>{
        
        set({isloadingcomment:true});
        try {
           const res = await axiosInstance.get('comment/'+id);
           set({comments:res.data}); 
        } catch (error) {
            console.log(error.message);
        }finally{
            set({isloadingcomment:false});
        }
    },
    deletecomment: async(id)=>{
        set({deletecomment:true});
        try {
            const res = await axiosInstance.delete('comment/'+id);
            const remove  = get().comments.filter(t=>t._id != id);
            set({comments:remove});
        } catch (error) {
            console.log(error.message);
        }finally{
            set({deletecomment:false});
        }
    },
    listencomment: (id)=>{
        const sock = Userstore.getState().socket;
        sock.on("comments",(msg)=>{
            if(msg.post == id){
                set({comments:[...get().comments,msg]});
            }
        });
    },
    stoplisten:()=>{
        const sock =  Userstore.getState().socket;
        sock.off("comments");
    },
}));