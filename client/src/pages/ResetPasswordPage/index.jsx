import React, { useContext, useState } from 'react'
import Navbar from '../../components/Navbar'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ResetPasswordPage = () => {
  const navigate = useNavigate()
    const { userData } = useContext(AppContext);
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("")
    const {backendUrl, setisLoggedIn, getUserData} = useContext(AppContext)
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
      e.preventDefault();
      
      try {
        axios.defaults.withCredentials=true
        setLoading(true)
        const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {newPassword,newPasswordRepeat});

        
        
        if(data.success){
          toast.success(data.message)
          setLoading(false)
          setisLoggedIn(true)
          getUserData()
          
         
            navigate('/dashboard')
  
         
        }else{
          setLoading(false);
          toast.error(data.message)
        }
  
      } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message );
      }
    }
    
  return (
    <div className="flex flex-col">
      <Navbar />
    <div className="flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 90px)" }}>
      <div className="bg-[#242424] px-12 py-16 rounded-2xl shadow-lg w-[25%]">
        <form 
        onSubmit={onSubmitHandler} 
        className="flex flex-col gap-6">
          <div className="mb-6 flex justify-center items-center">
          <img src="../../011.png" className='w-50'/>
          </div>
          <div className="text-white flex flex-col gap-2">
            <label htmlFor="auth-code" className="text-sm font-semibold">
              Yeni şifrə
            </label>
            <input
              id="auth-code"
              value={newPassword}
              name='newPassword'
              onChange={e => setNewPassword(e.target.value)}
              type="password"
              placeholder="Yeni şifrənizi təyin edin"
              className="px-4 py-2 rounded-lg bg-[#454444] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-white flex flex-col gap-2">
            <label htmlFor="auth-code" className="text-sm font-semibold">
              Yeni şifrənin təkrarı
            </label>
            <input
              id="auth-code-repeat"
              value={newPasswordRepeat}
              name='newPasswordRepeat'
              onChange={e => setNewPasswordRepeat(e.target.value)}
              type="password"
              placeholder="Yeni şifrənizi təkrar daxil edin"
              className="px-4 py-2 rounded-lg bg-[#454444] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
         <div>
                               <button
                                 type="submit"
                                 className="w-full flex py-3 bg-amber-300 text-[#242424] font-semibold rounded-lg border-2 border-transparent hover:bg-transparent hover:text-amber-300 hover:border-amber-300 transition-colors cursor-pointer justify-center items-center h-[50px]"
                               >
                                 {loading && (<ReactLoading type="spin" color="#242424" height={30}  width={30} />) }
                                 {!loading && (<span>Təstiq et</span>) }
                               
                           
                     
                               </button>
                             </div>
          <div className="text-left mt-0">
            {/* <Link to="/login" className="text-amber-400 hover:underline text-sm">
              Kodu yenidən göndər
            </Link> */}
          </div>
        </form>
      </div>
      
    </div>
    </div>
  )
}

export default ResetPasswordPage