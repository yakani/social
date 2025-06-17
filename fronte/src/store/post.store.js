import {create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios';
import { Userstore } from './user.store';

export const Poststore = create((set,get)=>({
    isloadingpost:false,
    isdeletingpost:false,
    isloadingpostuser:false,
    isadding:false,
    postsvisitor:[],
    posts:[],
    postuser:[],
    playingpost:null,
    arralgo:[],
    isloadinalgo:false,
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
        getpostsvisitor:async(data)=>{
        set({isloadingpostuser:true});
        try {
            const res = await axiosInstance.get('post/visitor/'+data);
            set({postsvisitor: res.data});
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
    setplayingpost :(data)=>set({playingpost:data}),
    getarralgo:async()=>{
        set({isloadinalgo:true});
        try {
            const res = await axiosInstance.get('user/observe');
            set({arralgo: res.data});
        } catch (error) {
            console.log(error.message);
        }finally{
            set({isloadinalgo:false});
        }
    },
    Algo : ()=>{

    //i have to take the data from my observazion  and transform that to an array of prompt to initiate to my data2
    const {posts ,numb} = get();
    if(posts.length < 10) return;
    let previous = [];
    let arr = [];
    let maxnum = numb == 0 ?  0 :  numb*3 > posts.length - 10? posts.length < 101 ? posts.length/2 : numb*2 : numb*3 ;
    for (let i =0; i < maxnum; i++) {
        previous.push(posts[i]);
    }
    for(let i = maxnum; i < posts.length; i++){
        arr.push(posts[i]);
    }
    const data2 = get().arralgo;
    let final = [];
    let stock = [];
    let temp = [];
    let  count =0;
    for(let y=0; y < data2.length; y++) {
        const element = data2[y];
        if(y == 0){
        for(var i = 0;  i< arr.length; i++){
            if(arr[i].prompt.includes(element) && count <3){
                count++;
                final.push(arr[i]);
            }else if(count >2){
                count = 0;
                if(stock.length > 0){
                    final.push(stock.shift());
                }else{
                    final.push(arr[i]);
                }  
                if(arr[i].prompt.includes(element)){
                    count++;
                    final.push(arr[i]);
                }else{
                    stock.push(arr[i]);
                }
               
            }else{
                stock.push(arr[i]);
            }
          
        }
    temp = stock;
    
    stock = [];
    }else{
        count = 0;
            for(var i = 0;  i< temp.length; i++){
                if(temp[i].prompt.includes(element) && count <3){
                    count++;
                    final.push(temp[i]);
                }else if(count >3){
                    count = 0;
                    if(stock.length > 0){
                        final.push(stock.shift());
                    }else{
                        final.push(temp[i]);
                    }  
                    if(temp[i].prompt.includes(element)){
                        count++;
                        final.push(temp[i]);
                    }else{
                        stock.push(temp[i]);
                        }
                }else{
                    stock.push(temp[i]);
                }
                
            }
            temp = stock;

            stock =  y == data2.length - 1 ? stock : [];
        }
    }
    final = stock.length >0 ?  final.concat(stock) : final;
    final = previous.concat(final);
    set({posts: final});
    },
    addobserve:async(data)=>{
       
        try {
            const res = await axiosInstance.post('user/observe', data);
        } catch (error) {
            console.error(error.message);
        }
    }
}));