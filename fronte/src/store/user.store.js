import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import {io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Poststore } from './post.store';
export const  Userstore = create((set,get)=>({
user:null,
isentring:false,
ischecking:false,
islogingout:false,
isupdating:false,
isloading:false,
onlineuser:[],
socket:null,
alluser:[],

Register : async(data)=>{
    set({isentring:true});
    try {
        const res  = await axiosInstance.post('user/signup',data);
        set({user:res.data});
        get().connectsocket();
        toast.success("register");
    } catch (error) {
        toast.error(error.message);
    }finally{
        set({isentring:false}); 
    }
},
Login :async(data)=>{
    set({isentring:true});
    try {
        const res  = await axiosInstance.post('user/login',data);
        set({user:res.data});
        get().connectsocket();
        toast.success("login");
    } catch (error) {
        toast.error(error.message);
    }finally{
        set({isentring:false}); 
    }
},
Logout : async()=>{
    set({islogingout:true});
    try {
        const res  = await axiosInstance.post('user/logout');
        set({user:null});
        get().disconnectsocket();
        toast.success("logout");
    } catch (error) {
        toast.error(error.message);
    }finally{
        set({islogingout:false}); 
    }
},
Updatepic : async(data)=>{
    set({isupdating:true});
    try {
        const res  = await axiosInstance.put('user/avatar',data,{
                           headers: {
         'Content-Type': 'multipart/form-data',
      },
        });
        set({user:res.data});
        toast.success("update");
    } catch (error) {
        toast.error(error.message);
    }finally{
        set({isupdating:false}); 
    }
},
Updateuser:async(data)=>{
    set({isupdating:true});
    try {
        const res  = await axiosInstance.put('user',data);
        set({user:res.data});
        toast.success("register");
    } catch (error) {
        toast.error(error.message);
    }finally{
        set({isupdating:false}); 
    }
},
Checkauth:async()=>{
    set({ischecking:true});
    try {
        const res  = await axiosInstance.get('user');
        set({user:res.data});
        get().connectsocket();
    } catch (error) {
       console.log(error.message);
    }finally{
        set({ischecking:false}); 
    }
},
connectsocket:()=>{
    const {user} = get()
    if(!user || get().socket?.connected)return;
    const sock = io(import.meta.env.VITE_Api2,{
      query:{
        userID:user._id
      }
    });
    sock.connect();
    sock.on("onlineusers",(ids)=>{
      set({onlineuser:ids});
    });
    set({socket : sock});
  },
  disconnectsocket:()=>{
    if(get().socket?.connected){

    get().socket.disconnect();
    set({socket:null});
    } 
  },
  getalluser:async()=>{
    set({isloading:true});
    try {
        const res  = await axiosInstance.get('user/all');
        set({alluser:res.data});
    } catch (error) {
        console.log(error.message);
    }finally{
        set({isloading:false}); 
    }
}
}));