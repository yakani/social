import React from 'react'
import { Userstore } from '../store/user.store'
import { Link } from 'react-router-dom';
import {Home, LogIn, LogOut, MessageSquare, PlusCircle, Settings, User2} from 'lucide-react'

const Navbar = () => {
    const {user , Logout} = Userstore();
  return (
   
    <div className="flex   justify-between max-h-[200px]  bg-neutral " >
        
          <Link to={"/chat"}>
             <div className="size-9 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-content hover:text-warning" />
              </div>
              <span className=' hidden text-primary-content text-center sm:inline '>chat </span>
        </Link>   
        
        <div className='flex justify-between m-2'>
            <Link to={"/"} className=' gap-2 m-2 '>
                        <Home className='w-6 h-6 text-primary-content hover:text-warning'/>
                        <span className="hidden sm:hidden   text-primary-content">Home</span>
            </Link>
            <Link
              to={"/setting"}
              className={`
               gap-2 m-2 
              `}
            >
              <Settings className="w-6 h-6 text-primary-content hover:text-warning" />
              <span className="hidden sm:hidden   text-primary-content">Settings</span>
            </Link>
        {
            user ? <>
                       
                        <Link to={"/add"} className=' gap-2 m-2 '>
                        <PlusCircle className='w-6 h-6 text-primary-content hover:text-warning'/>
                        <span className="hidden sm:hidden   text-primary-content">Post</span>
                        </Link>
                        <Link to={"/user"} className=' gap-2 m-2  '>
                        <User2 className='w-6 h-6 text-primary-content hover:text-warning'/>
                        <span className=" sm:hidden  text-primary-content">Account</span>
                        </Link>
                         <Link onClick={Logout} className=' gap-2 m-2 '>
                        <LogOut  className='w-6 h-6 text-primary-content hover:text-warning'/>
                        <span className=" sm:hidden  text-primary-content">logout</span>
                        </Link>
                    
           </> :<>
              <Link to={'/login'} className='gap-2 m-2 '>
              <LogIn  className='w-6 h-6 text-primary-content hover:text-warning'/>
              <span className=' sm:hidden  text-primary-content'>login</span>
              </Link>
           </>
        }
      </div>
    </div>
   
  )
}

export default Navbar
