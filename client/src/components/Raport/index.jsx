import { Download, File } from 'lucide-react'
import React from 'react'

const Raport = ({raportTempNo,raportNo,id}) => {

    
      const handleDownload = () => {
        const downloadUrl = `http://localhost:5001/api/raports/download/${id}`;
        
        window.location.href = downloadUrl;
      };
  return (
    <div className='flex flex-col gap-2 text-center bg-[#e9ecef] p-5 rounded-3xl items-center justify-center'>
        <div>Müvəqqəti Raport №-si: {raportTempNo}</div>
        <div>Sənəd №-si: {raportNo}</div>
        <div><File className='text-[#242424] p-4 h-[150px] w-[150px] rounded-md'/></div>
    
        <div className="w-full">
        <button
          onClick={handleDownload}
          className="flex justify-center items-center bg-[#28a745] text-white py-2 px-6 rounded-full font-semibold w-full transition duration-300 hover:bg-[#218838] focus:outline-none focus:ring-2 focus:ring-[#218838] focus:ring-opacity-50 cursor-pointer"
        >
          <Download className="mr-2" />
          Raporu Yüklə
        </button>
      </div>
    </div>
  )
}

export default Raport