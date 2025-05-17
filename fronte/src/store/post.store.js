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
    numb: parseInt(localStorage.getItem('numb') ) || 0,

    setnumb : (num)=>{
        localStorage.setItem('numb',String(num));
       set({numb:num}) ;
    } ,
    previousplay :()=>{
        const {playingpost  , numb , posts } = get();
        for(var  i = numb ;  i >= 0; i++){
            console.log(numb);
            if( posts[i]._id == playingpost._id){
                if(i  == numb)
                {
                    localStorage.setItem('numb', String(numb-3));
                set({numb:numb - 3});
                }
                set({playingpost:posts[i-1]});
            break;
        }}
        
    },

    nexplay : ()=>{
        const {playingpost  , numb , posts } = get();
        for(var  i = numb ;  i <posts.length; i++){
            if( posts[i]._id == playingpost._id){
                
            if( i == numb +2){
                localStorage.setItem('numb',String(numb+3));
                set({numb:numb+3});
                    
            }
            set({playingpost:posts[i+1]});
            break;
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