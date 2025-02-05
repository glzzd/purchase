import React from 'react'
import {Routes, Route} from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OTPPage from './pages/OTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/DashboardPage'
import AllOrders from './pages/OrdersPage/AllOrdersPage'
import MakeOrder from './pages/OrdersPage/MakeOrderPage'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/verify-otp' element={<OTPPage/>} />
        <Route path='/reset-password' element={<ResetPasswordPage/>} />


        <Route element={<MainLayout/>}>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/orders/all-order' element={<AllOrders/>} />
        <Route path='/orders/make-order' element={<MakeOrder/>} />

        </Route>

      </Routes>
    </div>
  )
}

export default App