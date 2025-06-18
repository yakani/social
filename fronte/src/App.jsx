
import {Navigate, Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import Navbar from './component/Navbar';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Homepage from './pages/Homepage';
import { Userstore } from './store/user.store';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { Poststore } from './store/post.store';
import Uploadvideo from './pages/Uploadvideo';
import Accountpage from './pages/Accountpage';
import Playpage from './pages/Playpage';
import Chatpage from './pages/Chatpage';
import Settingpage from './pages/Settingpage';
import { useThemeStore } from './store/theme.store';
import Profilepage from './pages/Profilepage';
const App = () => {
const { user  , ischecking ,Checkauth ,getsavesvideo ,getobservation} = Userstore();
const { getposts, getpostsuser} = Poststore();
const { theme} = useThemeStore();
useEffect(()=>{
  getpostsuser();
  getsavesvideo();
  getobservation();
  getposts();
  Checkauth();
},[Checkauth]);
if( !user && ischecking) return (
<div className="flex justify-center items-center h-screen">
  <Loader className='size-10 animate-spin text-yellow-500'/>
</div>
);


  return (
    <div data-theme={theme}>
    <Navbar/>
    <Routes>
      <Route path='/' element={user ? <Homepage/>:<Navigate to={"/login"}/>}/>
       <Route path='/add' element={user ? <Uploadvideo/>:<Navigate to={"/login"}/>}/>
      <Route path='/login' element={!user ?<Loginpage/> : <Navigate to={"/"}/>}/>
      <Route path='/signup' element={!user ? <Registerpage/> : <Navigate to={"/"}/>}/>
      <Route path='/user' element={user ? <Accountpage/> : <Navigate to={"/login"} />}/>
      <Route  path='/play' element={user ? <Playpage/> : <Navigate to={"/login"} />} />
      <Route path='/chat' element={user ? <Chatpage/> : <Navigate to={"/login"}/>}/>
      <Route path='/setting' element={user ? <Settingpage/> :<Navigate to={"/"} />} />
        <Route path='/visit' element={user ? <Profilepage/>:<Navigate to={"/login"}/>}/>
      <Route path='*' element={<Navigate to={"/"} />} />
    </Routes>
    <Toaster/>
    </div>
  )
}

export default App
