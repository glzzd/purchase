import React from 'react'
import {Routes, Route, Navigate} from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OTPPage from './pages/OTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/DashboardPage'
import AllOrders from './pages/OrdersPage/AllOrdersPage'
import MakeOrder from './pages/OrdersPage/MakeOrderPage'
import Raports from './pages/RaportsPage'
import Lots from './pages/LotsPage'
import Contracts from './pages/ContractsPage'
import Companies from './pages/CompaniesPage'
import Categories from './pages/CategoriesPage'
import ExpenseItems from './pages/ExpenseItems'
import AllUsersPage from './pages/UsersPage/AllUsersPage'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        {/* <Route path='/' element={<HomePage/>} /> */}
        <Route path='/' element={<Navigate to="/login" replace/>}/>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/verify-otp' element={<OTPPage/>} />
        <Route path='/reset-password' element={<ResetPasswordPage/>} />


        <Route element={<MainLayout/>}>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/orders/all-order' element={<AllOrders/>} />
        <Route path='/orders/make-order' element={<MakeOrder/>} />
        <Route path='/my-orders' element={<Raports/>} />
        <Route path='/lots' element={<Lots/>} />
        <Route path='/expense-items' element={<ExpenseItems/>} />
        <Route path='/contracts' element={<Contracts/>} />
        <Route path='/companies' element={<Companies/>} />
        <Route path='/categories' element={<Categories/>} />
        <Route path='/users' element={<AllUsersPage/>} />

        </Route>

      </Routes>
    </div>
  )
}

export default App