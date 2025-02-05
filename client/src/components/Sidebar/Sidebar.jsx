import React from 'react';
import LogoArea from './LogoArea';
import MenuArea from './MenuArea';
import ProfileArea from './ProfileArea';
import ModuleArea from './ModuleArea';
import { NavLink } from 'react-router';


const Sidebar = ({user}) => {

  
  return (
    <div className="h-screen bg-[#242424] text-white flex flex-col">

      <NavLink to="/" className="p-4">
        <LogoArea />
      </NavLink>


      <div className="border-t border-gray-700 my-1"></div>
    



      <div className="flex-grow p-4">
        <MenuArea />
      </div>

      <div className="border-t border-gray-700 my-1"></div>
      <div className="p-4">
        <ProfileArea userData = {user} />
      </div>

    </div>
  );
};

export default Sidebar;
