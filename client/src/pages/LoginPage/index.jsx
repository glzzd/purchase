import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router";
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios'
import ReactLoading from 'react-loading';

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const {backendUrl, setisLoggedIn, getUserData} = useContext(AppContext)
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      axios.defaults.withCredentials=true
      setLoading(true)
      const {data} = await axios.post(backendUrl + '/api/auth/login', {email,password});
      
      if(data.success){
        
        toast.success(data.message)
        setLoading(false)
        setisLoggedIn(true)
        getUserData()
        navigate('/verify-otp')
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



    <div className="flex justify-center items-center h-screen flex-col">
    <div className="bg-[#242424] px-10 py-10 rounded-2xl shadow-lg w-[25%]">
      <form 

      onSubmit={onSubmitHandler} 
      className="flex flex-col gap-6">
        <div className="mb-6 flex justify-center items-center">
          <img src="../../011.png" className='w-50'/>
        </div>
        <div className="text-white flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mail ünvanınız"
            required
            className="px-4 py-2 rounded-lg bg-[#454444] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-white flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold">
            Şifrə
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Şifrəniz"
            required
            className="px-4 py-2 rounded-lg bg-[#454444] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex py-3 bg-amber-400 text-[#242424] font-semibold rounded-lg border-2 border-transparent hover:bg-transparent hover:text-amber-400 hover:border-amber-400 transition-colors cursor-pointer justify-center items-center h-[50px]"
          >
            {loading && (<ReactLoading type="spin" color="#242424" height={30}  width={30} />) }
            {!loading && (<span>Daxil ol</span>) }
          
      

          </button>
        </div>
        <div className="text-center mt-0">
          <Link to="/forgot-password" className="text-amber-400 hover:underline text-sm">
            Şifrənizi unutmusunuz?
          </Link>
        </div>
      </form>
    </div>
 
  </div>
  )
}

export default LoginPage