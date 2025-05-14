import { Eye, EyeClosed,  Loader, Lock,  Mail } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Userstore } from '../store/user.store';
import toast from 'react-hot-toast';

const Loginpage = () => {
  const { Login , isentring } = Userstore();
  const [showpass,setshowpass] = useState(false);
  const [formData ,setformData] =useState ({
    email:"",
    password:""
  });
  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };
  const handlesubmit = (e)=>{
    e.preventDefault();
    const success = validateForm();
    if(success == true) return Login(formData);
  }
  return (
    <div className=' flex justify-center min-h-[90vh] w-full p-4 bg-neutral'>
        <div className='flex flex-col p-2'>
          
    
            <h2 className='text-center text-3xl  text-primary-content text-bold'>Signin</h2>
           <form onSubmit={handlesubmit}>
             <div className="form-control">
            <label className="label">
              <span className="label-text text-primary-content font-medium">Email</span>
            </label>
            <div className="flex">
              
                <Mail className="size-9 m-1 text-primary-content" />
              <input
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e)=>setformData({...formData , email:e.target.value})}
              />
            </div>
            <label className="label">
              <span className="label-text text-primary-content font-medium">Password</span>
            </label>
            <div className="flex">
              
                <Lock className="size-9 m-1 text-primary-content" />
              <input
                type={showpass ? "text":"password"}
                className={`input input-bordered text-center w-full pl-10`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e)=>setformData({...formData ,password:e.target.value})}
              />
              { !showpass? <Eye className="size-9 m-1 text-primary-content cursor-pointer" onClick={()=>setshowpass(!showpass)}/> : <EyeClosed className="size-9 m-1 text-primary-content cursor-pointer" onClick={()=>setshowpass(!showpass)}/> }
             
            </div>
          </div>
              <button className='btn btn-xl w-full btn-warning '>
                { isentring  ? <Loader className='size-8 animate-spin'/> : "Login"}
              </button>
             
           </form>
           <a href={`${import.meta.env.VITE_Api}auth/google`} className='flex justify-center mt-4 bg-yellow-500 p-2 rounded-xl cursor-pointer'> 
                <img src="/google.png" alt="" className='w-[30px] h-[30px] m-1 rounded-full'/> 
                <span className=' text-xl m-1 text-neutral text-center'>SignIn with google</span></a>
                <p className='text-center text-xl text-primary-content mt-2 '> I don't have an Account 
                   <Link to={"/signup"}><span className='text-yellow-500 text-2xl'>  Signup</span></Link></p>
        </div>
    </div>
  )
}

export default Loginpage
