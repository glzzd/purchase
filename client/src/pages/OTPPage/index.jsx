import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router'; // Düzgün import
import { AppContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';


const OTPPage = () => {
  const navigate = useNavigate()

  const { userData } = useContext(AppContext);
    const [loading, setLoading] = useState(false)
  const [otp, setOTP] = useState("")
  const {backendUrl, setisLoggedIn, getUserData} = useContext(AppContext)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      axios.defaults.withCredentials=true
      setLoading(true)
      const {data} = await axios.post(backendUrl + '/api/auth/verify-otp', {otp});
      
      
      if(data.success){
        toast.success(data.message)
        setLoading(false)
        setisLoggedIn(true)
        getUserData()
        
        if(userData.isFirstLogin === true){

          navigate('/reset-password')
        }else {
          navigate('/dashboard')

        }
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
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 90px)" }}
      >
        <div className="bg-[#242424] px-12 py-16 rounded-2xl shadow-lg w-[25%]">
          <form className="flex flex-col gap-6" onSubmit={onSubmitHandler}>
            <div className="mb-6 flex justify-center">
              <img src="../../011.png" className="w-50" alt="Logo" />
            </div>
            <div className="text-white flex flex-col gap-2">
              <label htmlFor="auth-code" className="text-sm font-semibold">
                Təstiqləmə kodu
              </label>
              <input
                id="auth-code"
                type="text"
                name='otp'
                value={otp}
                onChange={e => setOTP(e.target.value)}
                placeholder="E-mail ünvanınıza göndərilən kodu daxil edin"
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
            <div className="text-center mt-0">
              <Link to="/login" className="text-amber-400 hover:underline text-sm">
                Kodu yenidən göndər
              </Link>
            </div>
          </form>
        </div>
        <div className="text-center mt-4">
          <span className="text-[#242424] font-bold text-sm">
            Hesabınıza&nbsp;
            <Link to="/login" className="text-amber-400 hover:underline text-sm cursor-pointer">
              daxil ol
            </Link>un
          </span>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
