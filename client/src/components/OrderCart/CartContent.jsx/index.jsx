import React, { useContext } from "react";
import { Button } from "antd";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const CartContent = () => {
  const { userBacket, setUserBacket } = useContext(AppContext);

  if (!userBacket || userBacket.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 w-[500px] text-center">
        <span className="text-gray-500 text-lg">Səbətiniz boşdur.</span>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/backet/delete-backet-item",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: id }),
          credentials: "include",
        }
      );
  
      // Yanıtı JSON formatına çevir
      const data = await response.json();

  
      if (response.ok) {
        toast.success("Məhsul səbətdən silindi.");
        // userBacket listesini güncelle
        if (setUserBacket) {
          setUserBacket((prevBacket) =>
            prevBacket.filter((item) => item._id !== id)
          );
        }
        window.location.reload()
      } else {
        toast.error(data.message || "Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      toast.error("Məhsul silinərkən xəta baş verdi.");
      console.error(error);
    }
  };
  

  const handleGenerateReport = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/backet/generate-raport", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        window.location.reload()
      } else {
        const data = await response.json();
        toast.error(data.message || "Raport oluşturulamadı.");
      }
    } catch (error) {
      toast.error("Raport oluşturulurken bir hata oluştu.");
      console.error(error);
    }
  };
  
  
  

  return (
    <div className="bg-white rounded-lg p-4 w-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-xl font-semibold text-gray-800">Səbətim</span>
        <span className="text-blue-500 font-medium cursor-pointer hover:underline">
          Ətraflı
        </span>
      </div>

      {/* Table */}
      <table className="table-auto w-full text-sm text-left mt-3">
        <thead>
          <tr className="text-gray-500">
            <th className="px-4 py-2 font-semibold">İstehlakçı</th>
            <th className="px-4 py-2 font-semibold">Məhsul</th>
            <th className="px-4 py-2 font-semibold">Sayı</th>
            <th className="px-4 py-2 font-semibold">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {userBacket.map((item) => (
            <tr key={item._id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{item.order_for}</td>
              <td className="px-4 py-2">{item.product}</td>
              <td className="px-4 py-2 text-center">{item.order_count}</td>
              <td className="px-4 py-2 text-center">
                <Button
                  type="primary"
                  size="small"
                  danger
                  onClick={() => handleDelete(item._id)}
                >
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Note */}
      <div className="mt-4">
        <span className="text-[12px] text-red-600">
          *Səbətinizdəki bütün məhsullar üçün{" "}
          <strong>sadəcə 1 raport</strong> generasiya ediləcək
        </span>
      </div>

      {/* Total Orders */}
      <div className="mt-4 flex justify-between items-center font-semibold">
        <span className="text-gray-800">Ümumi:</span>
        <span className="text-lg text-blue-600">
          {userBacket.length} sifariş
        </span>
      </div>

      {/* Confirm Button */}
      <div className="mt-6">
        <Button
          type="primary"
          size="large"
          block
          className="bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:bg-blue-700"
          onClick={handleGenerateReport}
        >
          Raport yarat
        </Button>
      </div>
    </div>
  );
};

export default CartContent;
