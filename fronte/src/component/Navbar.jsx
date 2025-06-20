import React from 'react'
import { Userstore } from '../store/user.store'
import { Link } from 'react-router-dom';
import {Home, LogIn, LogOut, MessageSquare, PlusCircle, Settings, User2} from 'lucide-react'

const Navbar = () => {
    const {user , Logout} = Userstore();
  return (
   
    <div className="flex   justify-between max-h-[200px]  bg-neutral max-w-screen" >
        
          <Link to={"/chat"}>
             <div className="size-9 rounded-lg flex items-center justify-center tooltip  tooltip-bottom" data-tip="chat">
                <MessageSquare className="w-6 h-6 text-primary-content hover:text-warning" />
              </div>
              
        </Link>   
        
        <div className='flex justify-between m-2'>
            <Link to={"/"} className=' gap-2 m-2 tooltip  tooltip-bottom ' data-tip="home">
                        <Home className='w-6 h-6 text-primary-content hover:text-warning'/>
                        
            </Link>
            <Link
              to={"/setting"}
              className={`
               gap-2 m-2 tooltip  tooltip-bottom
              `}
              data-tip="settings"
            >
              <Settings className="w-6 h-6 text-primary-content hover:text-warning" />
              
            </Link>
        {
            user ? <>
                       
                        <Link to={"/add"} className=' gap-2 m-2 tooltip  tooltip-bottom ' data-tip="Add post">
                        <PlusCircle className='w-6 h-6 text-primary-content hover:text-warning'/>
                        
                        </Link>
                        <Link to={"/user"} className=' gap-2 m-2  tooltip  tooltip-bottom' data-tip="Account">
                        <User2 className='w-6 h-6 text-primary-content hover:text-warning'/>
                        
                        </Link>
                         <Link onClick={Logout} className=' gap-2 m-2 tooltip  tooltip-bottom' data-tip="logout">
                        <LogOut  className='w-6 h-6 text-primary-content hover:text-warning'/>
                        </Link>
                    
           </> :<>
              <Link to={'/login'} className='gap-2 m-2 tooltip  tooltip-bottom ' data-tip="login">
              <LogIn  className='w-6 h-6 text-primary-content hover:text-warning'/>
      
              </Link>
           </>
        }
      </div>
    </div>
   
  )
}

export default Navbar
