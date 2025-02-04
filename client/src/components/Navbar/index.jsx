import React, { useContext } from 'react'
import {Link} from 'react-router'
import {LogIn, LogOut} from 'lucide-react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {
    const {userData, backendurl, setUserData, setisLoggedIn} = useContext(AppContext)
  return (

        <div className='flex justify-between py-5 px-10 '>
            <div>
                <img src="/007.png" alt="asd" className='w-50' />
            </div>
            {userData ? (<Link to="/dashboard" className='hover:bg-[#242424] hover:text-white border rounded'>
            <div className=' flex items-center px-5 py-3'>
                <div className='flex gap-2'>
                {userData.surname} {userData.name}  
                <LogOut />

                </div>
            </div>
                </Link>): (
                    <Link to="/login" className='hover:bg-[#242424] hover:text-white border rounded'>
                    <div className=' flex items-center px-5 py-3'>
                        <div className='flex gap-2'>
                        Daxil ol  
                        <LogIn />
        
                        </div>
                    </div>
                        </Link>
                )}
                
        </div>
  )
}

export default Navbar