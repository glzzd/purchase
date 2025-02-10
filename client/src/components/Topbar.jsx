import React, { useContext } from "react";
import { LogOut } from "lucide-react";
import ModuleArea from "./Sidebar/ModuleArea";
import OrderCart from "./OrderCart";
import { AppContext } from "../context/AppContext";
import {  useNavigate } from "react-router"; // react-router-dom kullanarak yönlendirme

const Topbar = () => {
  const navigate = useNavigate()
  const { userBacket } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',  
        credentials: 'include', 
      
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate('/login')
      } else {
        console.error('Çıxış edilmədi:', data.message);
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  return (
    <div className="h-15 flex items-center justify-between px-4">
      <div>
        <ModuleArea />
      </div>
      <div className="flex gap-4 items-center">
        <OrderCart itemCount={userBacket.length} />
        <LogOut
          onClick={handleLogout} 
          className="text-red-700 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Topbar;
