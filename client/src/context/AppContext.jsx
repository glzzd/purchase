import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)
    const [userBacket, setUserBacket] = useState([])

    const getAuthState = async () => {
      
            axios.defaults.withCredentials=true
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
      
            if(data.success){
                setisLoggedIn(true)
                getUserData()
                getUserBacket()
            }
       
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/user-detail')

            
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserBacket = async () => {
        try {
            axios.defaults.withCredentials=true
            const {data} = await axios.get(backendUrl + '/api/backet/get-backet')
            
            
            data.success ? setUserBacket(data.backet) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    const value = {
        backendUrl,
        isLoggedIn,
        setisLoggedIn,
        userData,
        userBacket,
        setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}