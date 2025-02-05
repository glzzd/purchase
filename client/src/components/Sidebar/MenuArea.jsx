import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { roles } from '../../consts/roles';
import { NavLink } from 'react-router';
import "./styles.css"

const MenuArea = () => {
  const { userData } = useContext(AppContext);

  const userRole = roles.find((role) => role.systemRole === userData?.systemRole);

  if (!userRole) {
    return (
      <div className="text-gray-500 text-center">
        Menyu tapılmadı.
      </div>
    );
  }

  return (
    <div className="rounded-md shadow p-4">
     
      <ul className="space-y-2">
        {userRole.menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.link}
             
              className="block px-2 py-2 rounded hover:bg-amber-400 hover:text-[#242424] text-white hover:font-medium font-medium transition-colors "
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuArea;