import React from "react";
import { Bell, Languages, LogOut, ShoppingCart } from "lucide-react";
import ModuleArea from "./Sidebar/ModuleArea";
import { Popover, Badge } from "antd";
import OrderCart from "./OrderCart";

const cartContent = (
  <div>
    <ul>
      <li>Ürün 1 - $20</li>
      <li>Ürün 2 - $30</li>
      <li>Ürün 3 - $15</li>
    </ul>
    <div>
      <strong>Toplam: $65</strong>
    </div>
  </div>
);

const Topbar = () => {
  return (
    <div className="h-15 flex items-center justify-between px-4">
      <div className="">
        <ModuleArea />
      </div>
      <div className="flex gap-4 items-center">

    
        <OrderCart itemCount={3} />
        <OrderCart itemCount={3} />
        <OrderCart itemCount={3} />
        <OrderCart itemCount={3} />
      
      </div>
    </div>
  );
};

export default Topbar;
