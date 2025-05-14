import {create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios';
import { Userstore } from './user.store';

export const Poststore = create((set,get)=>({
    isloadingpost:false,
    isdeletingpost:false,
    isloadingpostuser:false,
    isadding:false,
    posts:[],
    postuser:[],
    playingpost:null,
    numb:0,

    setnumb : (num)=> set({numb:num}),

    nexplay : ()=>{
        const {playingpost  , numb , posts } = get();
        for(var  i = numb ;  i <posts.length; i++){
            if( posts[i]._id == playingpost._id){
                
                if(i == posts.length - 1)
            {
                set({numb:0});
                set({playingpost:posts[0]});
                break;
            }else if( i == numb +2){
                    set({numb:numb+3});
                    set({playingpost:posts[i+1]});
            }else{
                set({playingpost:posts[i+1]});
        
            }
        }
    }
    },
    createPost: async (data)=>{
       
        set({isadding:true});
        try {
            const res = await axiosInstance.post('post',data,{
                   headers: {
         'Content-Type': 'multipart/form-data',
      },
            });
            set({posts: [...get().posts,res.data]});
            set({postuser: [...get().postuser,res.data]});
            toast.success("upload");
        } catch (error) {
            toast.error(error.message);
        }finally{
            set({isadding:false});
        }
    },
    getposts:async()=>{
        set({isloadingpost:true});
        try {
            const res = await axiosInstance.get('post');
            set({posts: res.data});
        } catch (error) {
            console.log(error.message);
        }finally{
            set({isloadingpost:false});
        }
    },
    getpostsuser:async()=>{
        set({isloadingpostuser:true});
        try {
            const res = await axiosInstance.get('post/user');
            set({postuser: res.data});
        } catch (error) {
            console.log(error.message);
        }finally{
            set({isloadingpostuser:false});
        }
    },
    deletepost:async(id)=>{
        set({isdeletingpost:true});
        
        try {
            const res = await axiosInstance.delete('post/'+id);
            const remove  = get().posts.filter(t=> t._id != id);
            const remove1  = get().postuser.filter(t=> t._id != id);
            set({posts: remove});
            set({postuser:remove1});
            toast.success('remove');
        } catch (error) {
            toast.error(error.message);
        }finally{
            set({isdeletingpost:false});
        }
    },
    setplayingpost :(data)=>set({playingpost:data})
}));