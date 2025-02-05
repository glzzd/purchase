// ModuleArea.jsx
import React, { useContext } from "react";
import { Car, Users, ShoppingCart, User } from "lucide-react";
import { roles } from "../../consts/roles"; 
import { AppContext } from "../../context/AppContext";


const ModuleArea = () => {
  const { userData } = useContext(AppContext);

  const userRole = roles.find((role) => role.systemRole === userData?.systemRole);

  if (!userRole) {
    return null; // Kullanıcı rolüne uygun bir modül yoksa boş döner
  }

  let IconComponent;
  switch (userRole.elements.icon) {
    case "Car":
      IconComponent = Car;
      break;
    case "Users":
      IconComponent = Users;
      break;
    case "User":
      IconComponent = User;
      break;
    case "ShoppingCart":
      IconComponent = ShoppingCart;
      break;
    default:
      IconComponent = null;
  }

  return (
    <div className="bg-amber-300 px-4 py-2 text-center rounded-md text-[#242424] font-bold flex gap-4 items-center">
      {IconComponent && <IconComponent />}
      <div className="border-r border-gray-700 my-1 h-6"></div>
      <span>{(userRole.elements.name) ? userRole.elements.name : userData.position}</span>
    </div>
  );
};

export default ModuleArea;