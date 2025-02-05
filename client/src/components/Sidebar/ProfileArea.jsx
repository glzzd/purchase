import { LogOutIcon } from "lucide-react";
import React from "react";


const ProfileArea = ({userData}) => {

  return (
    <div className="bg-[#444444] px-4 rounded-3xl">
      <div className="flex justify-center gap-2 items-center">
        <div className="h-10 w-10 text-[#242424] font-bold bg-amber-400 rounded-4xl flex justify-center items-center">{`${userData.surname[0].toUpperCase()}${userData.name[0].toUpperCase()}`}</div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-amber-400 italic">{userData.rank}</span>
          <span className="text-sm text-white">{`${userData.surname} ${userData.name} ${userData.fathername}`}</span>
          <span className="text-sm text-zinc-400 italic">{userData.position}</span>
        </div>
   
      </div>
    </div>
  );
};

export default ProfileArea;
