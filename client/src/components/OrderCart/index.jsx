import React from "react";
import { Popover, Badge } from "antd";
import { ShoppingCart } from "lucide-react";
import CartContent from "./CartContent.jsx";


const OrderCart = ({ itemCount }) => {
  return (
      
      <Popover
        content={CartContent}
        trigger="click"
        placement="bottomRight"
        className="text-[#242424] hover:bg-amber-400 hover:text-white rounded-md cursor-pointer"
        >
      <div className="p-2">  
        <Badge
          count={itemCount}
          color="#FF5722"
          offset={[0, 0]}
          >
          <ShoppingCart />
        </Badge>
            </div>
      </Popover>
  );
};

export default OrderCart;
