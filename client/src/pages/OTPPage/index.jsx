import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Düzgün import
import { AppContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar';

const OTPPage = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col">
      <Navbar />
      {/* Main Content */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 90px)" }} // Navbar hündürlüyünü nəzərə alır
      >
        <div className="bg-[#242424] px-12 py-16 rounded-2xl shadow-lg w-[25%]">
          <form className="flex flex-col gap-6">
            <div className="mb-6 flex justify-center">
              <img src="../../011.png" className="w-50" alt="Logo" />
            </div>
            <div className="text-white flex flex-col gap-2">
              <label htmlFor="auth-code" className="text-sm font-semibold">
                Təstiqləmə kodu
              </label>
              <input
                id="auth-code"
                type="text"
                placeholder="E-mail ünvanınıza göndərilən kodu daxil edin"
                className="px-4 py-2 rounded-lg bg-[#454444] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-300 text-[#242424] font-semibold rounded-lg border-2 border-transparent hover:bg-transparent hover:text-amber-300 hover:border-amber-300 transition-colors cursor-pointer"
              >
                Təstiq et
              </button>
            </div>
            <div className="text-center mt-0">
              <Link to="/login" className="text-amber-400 hover:underline text-sm">
                Kodu yenidən göndər
              </Link>
            </div>
          </form>
        </div>
        <div className="text-center mt-4">
          <span className="text-[#242424] font-bold text-sm">
            Hesabınıza&nbsp;
            <Link to="/login" className="text-amber-400 hover:underline text-sm cursor-pointer">
              daxil ol
            </Link>un
          </span>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
