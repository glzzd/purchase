import React from 'react'
import {Routes, Route} from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OTPPage from './pages/OTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/verify-otp' element={<OTPPage/>} />
        <Route path='/reset-password' element={<ResetPasswordPage/>} />
      </Routes>
    </div>
  )
}

export default App