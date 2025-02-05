import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import ReactLoading from 'react-loading';

const MainLayout = () => {
  const { userData } = useContext(AppContext);



  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700"><ReactLoading type="spin" color="#FBBF24" height={50}  width={50} /></div>
      </div>
    );
  }

  

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <div className="w-[270px] bg-[#242424] text-white">
        <Sidebar user={userData} />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="shadow-md bg-white">
          <Topbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#e9ecef]">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="bg-white shadow-md text-center">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
